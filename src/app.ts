import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'


config()


const PORT = process.env.PORT || 3003
export const app = express()
app.use(express.json())

const allowedOrigins = [
  'http://127.0.0.1:5500', 
  'http://localhost:5500', 
  'http://10.23.1.19:5500',
  'https://max-menu.vercel.app',
  'https://admuser.onrender.com'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Não permitido pela política de CORS'))
    }
  },
  credentials: true
}))



app.listen(PORT, ()=>{
    console.log('Servidor rodando em http://localhost:3003')
})