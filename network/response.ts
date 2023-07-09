import { Request, Response } from "express"

const success = (req: Request, res: Response, menssages : any ,status: number) => {
    let statusCode = status || 200
    let statusMenssages = menssages || ''
    res.status(statusCode).send({
        error:false,
        status:status,
        body:statusMenssages,
    })
}

const error = (req : Request, res: Response, menssages : any , status: number) => {
    let statusCode = status || 500
    let statusMenssages = menssages || 'Internal server error'
    res.status(statusCode).send({
        error:false,
        status:statusCode,
        body:statusMenssages,
    })
}

export default {
error,
success,
}