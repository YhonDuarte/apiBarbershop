import express from "express";
import config from "../config";
import users from "./components/users/network"
import reservations from "./components/reservation/network"
import disabledDays from "./components/DISABLED_DAYS/network";
import auth from "./components/auth/network"
import errors from "../network/error"
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../utils/readme.json'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors())
const PORT = config.api.port;

app.listen(PORT, () => console.log(`App listening on port: ${PORT}`)) 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/users', users)
app.use('/api/reservations', reservations)
app.use('/api/disabled', disabledDays)
app.use('/api/auth', auth)
app.use(errors)