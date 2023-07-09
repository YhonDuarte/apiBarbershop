import { NextFunction, Request, Response } from "express"
import auth from "../../../auth/index"


const checkAuth = (action :string) => {
  const middelware = (req: Request, res:Response, next : NextFunction) =>{
    switch(action){
      case 'update' :
        auth.check.own(req)
        next()
          break
            default:
              next()
      }}
            return middelware
      }

export default checkAuth