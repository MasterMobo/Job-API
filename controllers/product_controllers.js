const Task = require("../models/product_model")

function parseNumericFilter(filer_str){
    // Parse filter string into mongoose-compatible format
    // Ex: "price<30,rating>=4.5"  =>  "price-$lt-30,rating-$gte-4.5"  
    const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
    }

    const regEx = /\b(>|>=|=|<|<=)\b/g     // Regex magic, dont even ask
    return filer_str.replace(regEx, (match)=>`-${operatorMap[match]}-`)
}

function addFilters(filer_str, query_object){
    // Parse mongoose-compatible filter string into attributes, then add the attributes to the query_object
    // Ex: "price-$lt-30,rating-$gte-4.5"  => { price: { '$lt': 30 }, rating: { '$gte': 4.5 } }
    const options = ["price", "rating"]
    filer_str = filer_str.split(",").forEach(item => {
        const[field, operator, value] = item.split("-")
        if (options.includes(field)){
            query_object[field] = {[operator]: Number(value)}
        }
    });
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject = {}

    if (featured != null) queryObject.featured = (featured === "true")
    if (company != null) queryObject.company = company
    if (name != null) queryObject.name = {$regex: name, $options: "i"}
    

    if (numericFilters != null){
        let filters = parseNumericFilter(numericFilters)
        addFilters(filters, queryObject)
    }

    console.log("Query object:",queryObject);

    let result = Task.find(queryObject)
    
    if (sort != null) {
        const sortParams = sort.replace(",", " ")
        result.sort(sortParams)
    } else {
        // Sort by ratings by default
        result.sort("-rating")
    }

    if (fields != null){
        const fieldsParams = fields.replace(",", " ")
        result.select(fieldsParams)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({success: true, hits: products.length, data: products})
}

module.exports = {getAllProducts}