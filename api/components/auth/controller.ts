import { tabla } from "../../../types/type"
import jwt from "../../../auth/index"
import bcrypt from "bcrypt"
import { auth } from "../../../types/interface"
import error from "../../../utils/error"

const TABLA: tabla = "AUTH"

const injectStore = (store: any ) => {

const login = async (email : string, password : string ) => {
  try {

    const data = await store.query(TABLA, {email: email})
    const isEqual = await bcrypt.compare(password, data.password)
      
      if(isEqual){   //token generator
        const user = await store.query("USERS", {id: data.fk_user})
        const sign = await jwt.sign(user)
        return  sign
      } throw error('invalid data', '401')}

  catch(err){ console.log(err) }
}

const updateAuth = async (DATA: auth) => store.updateAuth(TABLA, DATA);

    return {  login, updateAuth }
}

export default injectStore 