import 'dotenv/config'

const config = {
    api: {
        port:process.env.API_PORT
    },
    pgadmin:{
        host:process.env.PG_HOST || '',
        port:process.env.PG_PORT|| 3001,
        database:process.env.PG_DB || '',
        user:process.env.PG_USER || '',
        password:process.env.PG_PASSWORD || '',
    },
    jwt:{
        secrect:process.env.JWT_SECRECT || ''
    }
}

export default config