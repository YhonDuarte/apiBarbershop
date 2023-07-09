import express, { NextFunction, Request, Response } from "express"
import controller from './index'
import response from "../../../network/response"

const router = express.Router()

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await controller.login(req.body.email, req.body.password)
        response.success(req, res, token, 200)
    } catch (err) {
        next(err)
    }
})

export default router