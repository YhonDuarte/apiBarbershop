import express, { NextFunction, Request, Response } from 'express'
import controller from './index'
import response from '../../../network/response'
import secure from "../users/secure"

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tabla = await controller.list()
        response.success(req, res, tabla, 200)
    } catch (err) {
        next(err)
    }
})

router.get('/:id',async (req: Request, res: Response, next: NextFunction) => {
    try {
        const disabled = await controller.get(Number(req.params.id))
        response.success(req, res, disabled, 200)
    } catch (err) {
        next(err)
    }
})

router.post('/',async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await controller.insertDisabled(req.body)
        response.success(req, res, result, 200)
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', secure('update'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await controller.dlete(Number(req.params.id))
        response.success(req, res, result, 200)
    } catch (err) {
        next(err)
    }
})

export default router