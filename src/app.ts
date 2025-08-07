import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
//import cookieParser from 'cookie-parser'


config()


const PORT = process.env.PORT || 3003
export const app = express()
app.use(express.json())
//app.use(cookieParser())
app.use(cors())



app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost:3003`)
})
