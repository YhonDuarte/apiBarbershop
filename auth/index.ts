import { auth, userRequest } from "../types/interface";
import jwt from "jsonwebtoken"
import config from '../config'
import { Request } from "express";

const sign = async ( DATA :auth ) => jwt.sign(DATA, config.jwt.secrect)

const check = {
    own : (req : Request) => {
        const decoded : any = decodeHeader(req)
           
        if(decoded.rol  !== 'superUser' ){ // Check the role of the logged in user
            throw new Error('only the administrator can perform this action')
        }
    }}

const verifyToken= (token : string ) => jwt.verify(token, config.jwt.secrect )

const getToken = (auth :string ) => {
    if(!auth){
        throw new Error('no se obtubo el token')
    }
    if(auth.indexOf('Bearer ') === -1){
        throw new Error("formato de token invalido")  
    }

    let token = auth.replace('Bearer ', '')
    return token
}

const decodeHeader = (req:userRequest) => {
    const authorization = req.headers.authorization || ''
    const token = getToken(authorization)
    const decoded = verifyToken(token)
    req.user = decoded
    return decoded
}

export default {
    sign,
    check,
}