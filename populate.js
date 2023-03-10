require("dotenv").config()
const connectDB = require("./db/connect")
const product_data = require("./products.json")
const Product = require("./models/product_model")

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany();
        await Product.create(product_data)
        console.log("Successfully populated database")
        process.exit(0)
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}
start()