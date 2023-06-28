const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");
const hasProperties = require("../errors/hasProperties.js");
const hasRequiredProperties = hasProperties("table_name", "capacity")

async function list(req, res) {
    const data = await service.list()
    res.json({data});
}

async function create(req, res, next) {

    const newTable = ({
      table_name,
      capacity
    } = req.body.data)
    const createdTable = await service.create(newTable)
    res.status(201).json({ data: createdTable })
}


//---------------  MIDDLEWARES   ----   VALIDATIONS  -----------
function validateCapacity(req,res,next){
    if(!req.body.data.capacity || typeof req.body.data.capacity !== "number" ){
        next({
            status: 400,
            message: 'capacity must be a number'
        });
    } else {
        next();
    }
}

function validateNameLength(req, res, next){
    if(!req.body.data.table_name || req.body.data.table_name.length < 2){
        next({
            status: 400,
            message: 'table_name must be longer than one character'
        });
    } else {
        next();
    }
}


module.exports = {
    list,
    create: [
        hasRequiredProperties,
        validateCapacity,
        validateNameLength,
        asyncErrorBoundary(create)]
};