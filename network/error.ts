import {  NextFunction, Request, Response } from 'express';
import response from './response'


const errors = ( error :Error , req : Request, res : Response , next : NextFunction) => {
        if(error){
           console.error('[Error]', error.message )

        const message = error.message || 'Error interno';
        const status = res.statusCode || 500 ; 
        response.error(req, res, message, status)     
        }
}

export default errors