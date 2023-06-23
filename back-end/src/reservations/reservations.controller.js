const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("first_name", "last_name", "mobile_number", "people", "reservation_date", "reservation_time");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const reservation_date = req.query.date;
  const data = await service.list(reservation_date)
  res.json({data});
}

async function create(req, res, next) {
  const newReservation = ({
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time
  } = req.body.data)
  const createdReservation = await service.create(newReservation)
  res.status(201).json({ data: createdReservation })
}


//---------------  MIDDLEWARES   ----   VALIDATIONS  -----------
function validatePeople(req,res,next){
  //checks for input data
    if(!req.body.data.people || typeof req.body.data.people !== "number" ){
        next({
            status: 400,
            message: 'people must be a number'
        });
    } else {
        next();
    }
}

function validateDate(req,res,next){
  //checks for input data
  console.log(req.body.data.reservation_date instanceof Date)
    if(!req.body.data.reservation_date || req.body.data.reservation_date instanceof Date === false){
        next({
            status: 400,
            message: 'reservation_date must be a date'
        });
    } else {
        next();
    }
}

///--------------------------------------------

module.exports = {
  list,
  create: [hasRequiredProperties, validatePeople, asyncErrorBoundary(create)]
};
