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
  var isNumber = /^\d+$/
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
  let dateFormat = /^\d{4}\-\d{1,2}\-\d{1,2}$/
  //console.log(req.body.data.reservation_date.match(dateFormat))
  if(!req.body.data.reservation_date.match(dateFormat)){
      next({
          status: 400,
          message: 'reservation_date must be a date'
      });
  } else {
      next();
  }
}

function validateTime(req,res,next){
  //checks for input data
  let timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  //console.log(req.body.data.reservation_time)
  if(!req.body.data.reservation_time.match(timeFormat)){
      next({
          status: 400,
          message: 'reservation_time must be a valid'
      });
  } else {
      next();
  }
}

///--------------------------------------------

module.exports = {
  list,
  create: [hasRequiredProperties, validatePeople, validateDate, validateTime, asyncErrorBoundary(create)]
};
