import { disabled_days } from "../../../types/interface"

const TABLA = "DISABLED_DAYS"

const injectStore = (store : any) => {
    const list = () =>  store.list(TABLA)
    
    const get = ( ID : number) => store.get(TABLA,ID)
    
    const insertDisabled = (DATA : disabled_days) => store.insertDisabled(TABLA, DATA)
    
    const dlete = (id: number) => store.dlete(TABLA, id)

    return {
        list,
        get,
        insertDisabled,
        dlete
    }
}

export default injectStore