import { Request, Response, NextFunction } from 'express'
import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
//import cookieParser from 'cookie-parser'


config()


const PORT = process.env.PORT || 3003
export const app = express()
app.use(express.json())
//app.use(cookieParser())
const allowedOrigins = ['https://admuser.onrender.com', 'https://max-menu.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    console.log("CORS Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
        console.error("Origem não permitida pelo CORS:", origin)
        callback(null, false);
    }
  },
  credentials: true
}))

app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}))


app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  console.error('Erro capturado:', err)
  res.status(500).json({ message: 'Erro interno do servidor', error: err.message })
})


app.listen(PORT, ()=>{
    console.log('Servidor rodando em http://localhost:3003')
})