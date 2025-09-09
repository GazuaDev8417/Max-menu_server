import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import fs from 'fs'
import { config } from 'dotenv'


config()


const PORT = process.env.PORT || 3003
export const app = express()
app.use(express.json())

const swaggerPath = path.join(__dirname, './swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


const allowedOrigins = [
  'http://127.0.0.1:5500', 
  'http://localhost:5500', 
  'http://localhost:5173', 
  'http://10.23.1.19:5500',
  'http://10.23.1.19:5173',
  'http://10.23.1.14:5500',
  'http://10.23.1.14:5173',
  'https://max-menu.vercel.app',
  'https://admuser.onrender.com',
  'https://e-commerce-website-7uq3.onrender.com'
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
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`)
})