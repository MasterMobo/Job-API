require("dotenv").config()  // Load environment variable
require("express-async-errors") // Takes care of async errors (no more asyncWrappers!)

const express = require("express")
const app = express()

const connectDB = require("./db/connect")
const product_router = require("./routes/products_router")

// Middleware
const notFound = require("./middleware/not-found")
const errorHandler = require("./middleware/error-handler")
app.use(express.json())

// Routes
app.use("/api/v1/products", product_router)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, console.log(`Server is listening on port ${PORT}`))
    } catch(err){
        console.log(err)
    }
}
start()
