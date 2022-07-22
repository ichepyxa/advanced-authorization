const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./config/config')
const usersRouter = require('./routes/usersRouter')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/api/auth', usersRouter)
app.use(errorMiddleware)

async function start() {
	try {
		await mongoose.connect(config.DB_URL)
		app.listen(config.PORT, () => {
			console.log(`Server was started on port ${config.PORT}`)
		})
	} catch (error) {
		console.log(error)
	}
}

start()
