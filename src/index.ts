import { app } from './app'

app.get('/', (req, res) => {
  res.send('API está online 🚀')
})


export default app 