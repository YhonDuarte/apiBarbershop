import {  Request, Response } from 'express';
import response from './response'


const errors = ( error: any, req : Request, res : Response) => {
        if(error){
           console.error('[Error]', error)

        const message = error.message || 'Error interno';
        const status = error.statusCode || 500 ;
        response.error(req, res, message, status)     
        }
        
}

export default errors