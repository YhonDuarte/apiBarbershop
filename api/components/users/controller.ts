import auth from "../auth/index"
import { newUser } from "../../../types/interface"
import { tabla } from "../../../types/type"
import bcrypt from 'bcrypt'

const TABLA: tabla = "USERS"

const injectStore = (store:  any ): any => {
    
    const list = () =>  store.list(TABLA)

    const get = ( ID : number) => store.get(TABLA,ID)

    const insert = async (DATA : newUser) => {

        const dataUser : newUser = {
            name:DATA.name,
            last_name:DATA.last_name,
            phone:DATA.phone,
            email:DATA.email,
            rol:DATA.rol,
            }
            if(DATA.password){ // encrypt the password
                const password = await bcrypt.hash(DATA.password, 5)
                dataUser.password = password
            }

        return store.insertUser(dataUser)
}
    
    const upsert = async (DATA : newUser) => {
        
        const dataUser = {
            name:DATA.name,
            last_name:DATA.last_name,
            phone:DATA.phone,
            email:DATA.email,
            rol:DATA.rol, 
            id:DATA.id
        }    
        await store.updateUser(TABLA, dataUser)
        if(DATA.password){
            const password = await bcrypt.hash(DATA.password, 5)
            const dataAuth = {
                password,
                fk_user: DATA.id,
                email: DATA.email
                }
            auth.updateAuth(dataAuth) 
    }}

    const dlete = async (id: number) => {
        return store.dleteUser(id)
    }

    return {
        list,
        get,
        insert,
        dlete,
        upsert
    }
}

export default injectStore 