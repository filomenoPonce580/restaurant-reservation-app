const service = require("./tables.service");
const resService = require("../reservations/reservations.service");
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


async function read(req, res, next){
    res.json({data: res.locals.table})
}

async function update(req, res, next) {
    //access incoming resID
    let reservationId = req.body.data.reservation_id;   //returns number

    //create table object with updated reservation ID
    const updatedTable = {
        ...res.locals.table,
        reservation_id: reservationId
    }

    //update the table in DataBase
    await service.update(updatedTable)

    //read the updated table
    const update = await service.read(res.locals.table.table_id)
    const data = update
  
    //send res
    res.json({ data });
}

async function destroy(req, res, next) {
    const { tableId } = req.params
    const data = await service.delete(tableId);
    res.status(200).json({data});
}

async function freeTable(req, res, next) {
    //access table and res info
    const table = res.locals.table
    const reservation = await resService.read(table.reservation_id)
    //console.log(reservation)

    //set reservation status to "finished"
    const finishReservation = {
        ...reservation,
        status: "finished"
    }
    await resService.update(finishReservation)

    //create table object with updated reservation ID
    const updatedTable = {
        ...table,
        reservation_id: null
    }

    //update the table in DataBase
    await service.update(updatedTable)

    //read the updated table
    const update = await service.read(table.table_id)
    const data = update
  
    //send res
    res.status(200).json({ data });
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

async function validateTableExists(req, res, next){
    const {tableId} = req.params;

    const table = await service.read(tableId);
    if(table){
        res.locals.table = table;
        return next()
    }
    next({status: 404, message: `Table id${tableId} not found`})
}

function validateDataAndResId(req, res, next){
    if(!req.body.data){
        next({
            status: 400,
            message: 'data is missing'
        })
    }else if(!req.body.data.reservation_id){
        next({
            status: 400,
            message: 'reservation_id is missing'           
        })
    }else{
        next()
    }
}

async function validateResIdExists(req, res, next){
    //points to reservations/reservations.service and uses function there to check for resId
    const resId = req.body.data.reservation_id
    const reservation = await resService.read(resId)

    if(!reservation){
        next({
            status: 404,
            message: `reservation_id: ${resId} not found`
        })
    } else {
        res.locals.reservation = reservation
        next()
    }
}

//UserStory6 --

//validation. if res.status === seated, send error
function validateNotSeated(req, res, next){
    const reservation = res.locals.reservation;
    if(reservation.status === "seated"){
        next({
            status: 400,
            message: "reservation is already seated"
        });
    };
    next();
}

//updates the reservation status when table is sat
async function updateResStatus(req, res, next) {
    //access reservation data
    let reservation = res.locals.reservation;

    //create reservation object with updated status
    const updatedReservation = {
        ...reservation,
        status: "seated"
    }

    //update the reservation in DataBase
    await resService.update(updatedReservation)

    //might not need code, delete after completing
    //read the updated table
    // const update = await resService.read(reservation.reservation_id)
    // const data = update
  
    //move on
    next();
}



function validateTableAvailableAndCapacity(req, res, next){
    const tableCapacity = res.locals.table.capacity;
    const partySize = res.locals.reservation.people;

    if(res.locals.table.reservation_id){
        next({
            status: 400,
            message: `table is occupied`
        });
    } else if (partySize > tableCapacity){
        next({
            status: 400,
            message: `table does not have sufficient capacity`
        });
    }
    next();
}

function validateUnoccupied(req, res, next){
    const table = res.locals.table
    if(!table.reservation_id){
        next({
            status: 400,
            message: `not occupied`
        })
    } else {
        next()
    }
}

module.exports = {
    list,
    create: [
        hasRequiredProperties,
        validateCapacity,
        validateNameLength,
        asyncErrorBoundary(create)
    ],
    update: [
        validateDataAndResId,
        asyncErrorBoundary(validateResIdExists),
        validateNotSeated,
        updateResStatus,
        validateTableExists,
        validateTableAvailableAndCapacity,
        asyncErrorBoundary(update)
    ],
    freeTable: [asyncErrorBoundary(validateTableExists), validateUnoccupied, freeTable]
};