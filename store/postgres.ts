import config from '../config'
import { newUser, reservation, disabled_days, auth, connectiondata } from '../types/interface';
import { tabla } from '../types/type';
import  { Client } from 'pg'
const {pgadmin} = config;

export const connectionData : connectiondata  =  {
    user:pgadmin.user,
    host:pgadmin.host,
    database:pgadmin.database,
    password:pgadmin.password,
    port:Number(pgadmin.port),
}


let client : any;

export const handleConnect = async () => {
    client = new Client(connectionData)

    await client.connect()

    client.on('error', (err: string) => {
        console.log('[db err]', err);
        console.log('reconectando');
        setTimeout(handleConnect,2000)
    })

    console.log('client connected to the database');
   
    client.on('end', ()=> {
    console.log('client disconnected to database');
    })
}
handleConnect() 

 const list = async (TABLE : tabla) => {
    try{
        const dataUser = await client.query(`SELECT * FROM "${TABLE}"`)
        return dataUser.rows;
    }catch(err){    console.log('[err DB]',err)     }
    } 


const get = async (TABLE : tabla, ID : number) => {
    try {
        const data = await client.query(`SELECT * FROM "${TABLE}" WHERE id = $1`, [ID])    
        return data.rows[0]
    } catch (err) {
        console.log('[err DB]',err); 
    }
}

const dlete = async (TABLA: tabla , ID : number) => {
    try {
        await client.query(`DELETE FROM "${TABLA}" WHERE id = $1`, [ID])
        return 'removed from database'   
    } catch (err) {
        console.log('err al eliminar en' + TABLA ,err);
    }
    }

const query = async (TABLA : tabla ,  qr : any) =>{
    const data = await list(TABLA) 
    let key = Object.keys(qr)[0]
    const getResult = data?.filter((item: any) => item[key] === qr[key])[0] || null
    return getResult;
 }    

 export const insertDisabled = async (TABLA:tabla , DATA : disabled_days) => {
    try{
        if(!DATA.id) {        
            await client.query(`INSERT INTO "${TABLA}"(${Object.keys(DATA)}) VALUES ($1, $2, $3)`,  Object.values(DATA))
            return 'disabled days registereds'    
    }else{
        updateDisabled(TABLA, DATA);
        }
        }catch(err){console.log(err)
        }
    }

const updateDisabled = async (TABLA :tabla, DATA: disabled_days) => {
    try {
            await client.query(`UPDATE "${TABLA}" SET start_date = $1 , end_date = $2 , fk_user = $3 WHERE id = $4`, [DATA.start_date, DATA.end_date, DATA.fk_user, DATA.id])
            return 'disabled actualizado con exito'
    } catch (err) {
        console.log(err);
    }
    
} 


export const insertReservation = async (TABLA : tabla , DATA :reservation) => {
    try{
        if(!DATA.id) {        
            await client.query(`INSERT INTO "${TABLA}"(${Object.keys(DATA)}) VALUES ($1, $2, $3, $4, $5, $6)`,  Object.values(DATA))
            return 'registered reservation'    
    }else{
            updateReservation(TABLA, DATA);
        }
        }catch(err){console.log(err) }
}

const updateReservation = async (TABLA: tabla, DATA: reservation) => {
    try {
        await client.query(`UPDATE "${TABLA}" SET fk_user = $1 , date = $2 , email = $3 , name = $4 , last_name = $5 , phone_client = $6 WHERE id = $7`, [DATA.fk_user, DATA.date, DATA.email, DATA.name,DATA.last_name, DATA.phone_client, DATA.id])  
        return'reservation actualizada con exito'
    } catch (err) {
        console.log('error al actualizar cita',err);   
    }
}


export const insertUser = async ( DATA : newUser) => {
    try{    
        await client.query('BEGIN')
        const user = await client.query(`INSERT INTO "USERS"(name, last_name, rol, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [DATA.name, DATA.last_name, DATA.rol, DATA.email, DATA.phone])
        await client.query(`INSERT INTO "AUTH"(fk_user, email, password) VALUES ($1, $2, $3)`,  [user.rows[0].id, DATA.email , DATA.password])
        await client.query('COMMIT')
        return 'user added to system' 
        }catch(err){console.log(err, 'ocurrio un error en el llamdo')
            client.query('ROLLBACK')
    }}

export const updateUser = async (TABLA: tabla ,DATA : newUser ) => {

    try {
        await client.query(`UPDATE "${TABLA}" SET name = $1 , last_name = $2 , rol = $3 , email = $4 , phone = $5 WHERE id = $6`, [DATA.name, DATA.last_name, DATA.rol, DATA.email,DATA.phone, DATA.id])
        return 'user updated successfully'
    }catch (err) {
        console.log('error al actualizar',err);  
    }
}

export const updateAuth = async (TABLA :tabla , DATA : auth) => {
    try {
        await client.query(`UPDATE "${TABLA}" SET password = $1 , email = $2 WHERE fk_user = $3`, [DATA.password, DATA.email, DATA.fk_user])
        return'auth actualizado con exito';    
    } catch (error) {
        console.log(error);  
    }
}

export const dleteUser = async (ID : number) => {
    try {
        await client.query('BEGIN')
        await client.query(`DELETE FROM "AUTH" WHERE fk_user = $1`, [ID])
        await client.query(`DELETE FROM "USERS" WHERE id = $1`, [ID])
        await client.query('COMMIT')
        return 'removes the barbers record by his id'   
    } catch (err) {
        console.log(err, 'error al eliminar usuario');
        await client.query('ROLLBACK')
    }
}
export default { list, get, dlete, insertDisabled, insertUser, insertReservation,updateUser,updateAuth, dleteUser, query }