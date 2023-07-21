import { Request } from "express";
import { rol } from "./type";
import { JwtPayload } from "jsonwebtoken";

export interface userRequest extends Request {
    user?: string | JwtPayload
  }

export interface localError extends Error {
    statusCode?: string
}

export interface  connectiondata {
    user: string,
    host: string,
    database: string,
    password: string,
    port :number,
    }

export interface newUser {
    name: string,
    last_name:string,
    rol: rol,
    email:string,
    phone: number,
    password?:string, 
    id?: string,
}

export interface reservation {
    fk_user: number,
    date: string,
    email: string,
    name:string,
    last_name: string,
    phone_client: string,
    id?: number,
}

export interface disabled_days {
    id?: number,
    start_date:string,
    end_date:string,
    fk_user:number,
}

export interface auth {
    fk_user: string | undefined,
    email:string,
    password: string
}