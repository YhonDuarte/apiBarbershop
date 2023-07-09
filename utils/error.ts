import { localError } from "../types/interface"

const error = (message : string ,code : string) => {
    let e : localError= new Error(message)
    if(code){ e.statusCode = code }
    return e
}

export default error 