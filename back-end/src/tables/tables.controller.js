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
    let reservationId = req.body.data.reservation_id;

    const updatedTable = {
        ...res.locals.table,
        reservation_id: reservationId
    }

    await service.update(updatedTable)

    const update = await service.read(res.locals.table.table_id)
    const data = update
  
    res.json({ data });
}

async function destroy(req, res, next) {
    const { tableId } = req.params
    const data = await service.delete(tableId);
    res.status(200).json({data});
}

async function freeTable(req, res, next) {
    const table = res.locals.table
    const reservation = await resService.read(table.reservation_id)

    const finishReservation = {
        ...reservation,
        status: "finished"
    }
    await resService.update(finishReservation)

    const updatedTable = {
        ...table,
        reservation_id: null
    }

    await service.update(updatedTable)

    const update = await service.read(table.table_id)
    const data = update
  
    res.status(200).json({ data });
}


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

async function updateResStatus(req, res, next) {
    let reservation = res.locals.reservation;

    const updatedReservation = {
        ...reservation,
        status: "seated"
    }

    await resService.update(updatedReservation)

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
    list: [asyncErrorBoundary(list)],
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
        asyncErrorBoundary(updateResStatus),
        asyncErrorBoundary(validateTableExists),
        validateTableAvailableAndCapacity,
        asyncErrorBoundary(update)
    ],
    freeTable: [
        asyncErrorBoundary(validateTableExists),
        validateUnoccupied,
        asyncErrorBoundary(freeTable)
    ]
};