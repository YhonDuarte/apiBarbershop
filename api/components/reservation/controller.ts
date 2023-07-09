import { reservation } from "../../../types/interface"
import { tabla } from "../../../types/type"

const TABLA : tabla = "RESERVATIONS"

const injecStore = (store : any ) : any => {

    const list = () =>  store.list(TABLA)

    const get = (ID : number) =>  store.get(TABLA, ID)

    const insert = (DATA : reservation) => store.insertReservation(TABLA, DATA)

    const dlete = (ID : number) =>  store.dlete(TABLA, ID)

    return {
        list,
        get,
        insert,
        dlete,
    } 
}

export default injecStore
 