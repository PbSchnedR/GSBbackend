const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config()
const errorHandler = require('./middlewares/errorHandler')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})) 
// 

const mongoose = require('mongoose')
mongoose.connect(process.env.URI)
const db = mongoose.connection
db.on('error', (err) => {console.log('Error connecting to MongoDB', err)})
db.on('open', (err) => {console.log('connected to MongoDB')})

app.use(express.json())
const userRoute = require('./routes/user_route')
const billRoute = require('./routes/bill_route')
app.use('/api/users', userRoute)
app.use('/api/bills', billRoute)

const loginRoute = require('./routes/login_route')
app.use('/api/login', loginRoute)

const testRoute = require('./routes/test_route')
app.use('/api/test', testRoute)
app.use(errorHandler)


app.get('/',(req,res) => {
    res.send('<h1>site du ghb</h1>')
})

app.listen(port, () =>{
    console.log(`frr c'est sur http://127.0.0.1:${port}`)
})