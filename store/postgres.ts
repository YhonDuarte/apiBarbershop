import config from '../config'
import { newUser, reservation, disabled_days, auth, connectiondata } from '../types/interface';
import { tabla } from '../types/type';
import  { Client, Pool, PoolClient } from 'pg'
const {pgadmin} = config;

export const connectionData : connectiondata  =  {
    user:pgadmin.user,
    host:pgadmin.host,
    database:pgadmin.database,
    password:pgadmin.password,
    port:Number(pgadmin.port),
}


let pool : Pool;

const handleConnect = async () => {
    pool = new Pool(connectionData)

    pool.on('connect', (client : PoolClient)=> {
    console.log('client connect to database');
    })

    pool.on('acquire', (client : PoolClient)=> {
    console.log('client acquire');
    })

    pool.on('release', (err: Error, client : PoolClient) => {
        if(err){
         console.log( err, 'cliente: release')
        }
        console.log('client release');

    })

    pool.on('remove', (client : PoolClient) => {
        console.log('client remove');

    })
    pool.on('error', (err: Error, client : PoolClient) => {
        console.log('[db err]', err, 'cliente:', client);
        console.log('reconectando');
        setTimeout(handleConnect,2000)
    })
       
}
handleConnect() 

 const list = async (TABLE : tabla) => {
    const client = await pool.connect()
    try{
        const dataUser = await client.query(`SELECT * FROM "${TABLE}"`)
        return dataUser.rows;
    }catch(err){    console.log('[err DB]',err)  }finally{
        client.release()
    }
    } 


const get = async (TABLE : tabla, ID : number) => {
    const client = await pool.connect()
    try {
        const data = await client.query(`SELECT * FROM "${TABLE}" WHERE id = $1`, [ID]) 
        return data.rows
    } catch (err) {
        console.log('[err DB]',err); 
    }finally{
        client.release()
    }
}

const dlete = async (TABLA: tabla , ID : number) => {
    const client = await pool.connect()
    try {
        await client.query(`DELETE FROM "${TABLA}" WHERE id = $1`, [ID])
        return 'removed from database'   
    } catch (err) {
        console.log('err al eliminar en' + TABLA ,err);
    }finally{
        client.release()
    }
    }

const query = async (TABLA : tabla ,  qr : any) =>{
    const data = await list(TABLA) 
    let key = Object.keys(qr)[0]
    const getResult = data?.filter((item: any) => item[key] === qr[key])[0] || null
    return getResult;
 }    

 export const insertDisabled = async (TABLA:tabla , DATA : disabled_days) => {
    const client = await pool.connect()
    try{
        if(!DATA.id) {        
            await client.query(`INSERT INTO "${TABLA}"(${Object.keys(DATA)}) VALUES ($1, $2, $3)`,  Object.values(DATA))
            return 'disabled days registereds'    
    }else{
        updateDisabled(TABLA, DATA);
        }
        }catch(err){console.log(err)
        }finally{
            client.release()
        }
    }

const updateDisabled = async (TABLA :tabla, DATA: disabled_days) => {
    const client = await pool.connect()
    try {
            await client.query(`UPDATE "${TABLA}" SET start_date = $1 , end_date = $2 , fk_user = $3 WHERE id = $4`, [DATA.start_date, DATA.end_date, DATA.fk_user, DATA.id])
            return 'disabled actualizado con exito'
    } catch (err) {
        console.log(err);
    }finally{
        client.release()
    }
    
} 


export const insertReservation = async (TABLA : tabla , DATA :reservation) => {
    const client = await pool.connect()
    try{
        if(!DATA.id) {        
            await client.query(`INSERT INTO "${TABLA}"(${Object.keys(DATA)}) VALUES ($1, $2, $3, $4, $5, $6)`,  Object.values(DATA))
            return 'registered reservation'    
    }else{
            updateReservation(TABLA, DATA);
        }
        }catch(err){console.log(err) }finally{
            client.release()
        }
}

const updateReservation = async (TABLA: tabla, DATA: reservation) => {
    const client = await pool.connect()
    try {
        await client.query(`UPDATE "${TABLA}" SET fk_user = $1 , date = $2 , email = $3 , name = $4 , last_name = $5 , phone_client = $6 WHERE id = $7`, [DATA.fk_user, DATA.date, DATA.email, DATA.name,DATA.last_name, DATA.phone_client, DATA.id])  
        return'reservation actualizada con exito'
    } catch (err) {
        console.log('error al actualizar cita',err);   
    }finally{
        client.release()
    }
}


export const insertUser = async ( DATA : newUser) => {

    const client = new Client(connectionData) 
    await client.connect()
    try{    
        await client.query('BEGIN')
        const user = await client.query(`INSERT INTO "USERS"(name, last_name, rol, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [DATA.name, DATA.last_name, DATA.rol, DATA.email, DATA.phone])
        await client.query(`INSERT INTO "AUTH"(fk_user, email, password) VALUES ($1, $2, $3)`,  [user.rows[0].id, DATA.email , DATA.password])
        await client.query('COMMIT')
        return 'user added to system' 
        }catch(err){console.log(err, 'ocurrio un error en el llamdo')
            client.query('ROLLBACK')
    }finally{
        client.end()
    }}

export const updateUser = async (TABLA: tabla ,DATA : newUser ) => {
    const client = await pool.connect()
    try {
        await client.query(`UPDATE "${TABLA}" SET name = $1 , last_name = $2 , rol = $3 , email = $4 , phone = $5 WHERE id = $6`, [DATA.name, DATA.last_name, DATA.rol, DATA.email,DATA.phone, DATA.id])
        return 'user updated successfully'
    }catch (err) {
        console.log('error al actualizar',err);  
    }finally{
        client.release()
    }
}

export const updateAuth = async (TABLA :tabla , DATA : auth) => {
    const client = await pool.connect()
    try {
        await client.query(`UPDATE "${TABLA}" SET password = $1 , email = $2 WHERE fk_user = $3`, [DATA.password, DATA.email, DATA.fk_user])
        return'auth actualizado con exito';    
    } catch (error) {
        console.log(error);  
    }finally{
        client.release()
    }
}
//acomodar a cliente 
export const dleteUser = async (ID : number) => {
    let client = new Client(connectionData) 
    await client.connect()
    try {
        await client.query('BEGIN')
        await client.query(`DELETE FROM "AUTH" WHERE fk_user = $1`, [ID])
        await client.query(`DELETE FROM "USERS" WHERE id = $1`, [ID])
        await client.query('COMMIT')
        return 'removes the barbers record by his id'   
    } catch (err) {
        console.log(err, 'error al eliminar usuario');
        await client.query('ROLLBACK')
    }finally{
        client.end()
    }
}
export default { list, get, dlete, insertDisabled, insertUser, insertReservation,updateUser,updateAuth, dleteUser, query }