const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("first_name", "last_name", "mobile_number", "people", "reservation_date", "reservation_time");

/**
 * List handler for reservation resources
 */
async function read(req, res, next){
  res.json({data: res.locals.reservation})
}

async function list(req, res) {

  if(req.query.date){
    const reservation_date = req.query.date;
    const resList = await service.list(reservation_date)

    const data = resList.filter((res)=>{
      return res.status !== "finished"
    })

    res.json({data});
  }

  if(req.query.mobile_number){
    const number = req.query.mobile_number
    const data = await service.search(number)

    res.json({data})
  }
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

async function update(req, res, next) {
  const updatedInfo = req.body.data

  const reservation = res.locals.reservation
  const newReservation = {
    ...reservation,
    ...updatedInfo 
  }

  await service.update(newReservation)

  const update = await service.read(reservation.reservation_id)
  const data = update

  res.status(200).json({ data })
}

//---------------  MIDDLEWARES   ----   VALIDATIONS  -----------

//check if reservation exists
async function reservationExists(req, res, next){
  const reservation = await service.read(req.params.reservationId);
  if(reservation){
    res.locals.reservation = reservation;
    return next()
  }
  next({status:404, message: `reservation_id ${req.params.reservationId} not found`})
}

function validateBookedStatus(req, res, next){
  const status = req.body.data.status;

  if(status === 'seated'){
    next({
      status: 400,
      message: `status can not be "seated"`
    })
  } else if (status === 'finished'){
    next({
      status: 400,
      message: `status can not be "finished"`
    })
  } else {
    next()
  }
}

function validatePeople(req,res,next){
  //var isNumber = /^\d+$/
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
  if(!req.body.data.reservation_date.match(dateFormat)){
      next({
          status: 400,
          message: 'reservation_date must be a date'
      });
  } else {
      next();
  }
}

function validateOpenResDate(req, res, next) {
  const reservationDate = req.body.data.reservation_date;
  const date = new Date(reservationDate + "T00:00:00Z");

  if (date.getUTCDay() === 2) {
    return next({
      status: 400,
      message: "Sorry, we are closed on Tuesdays.",
    });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (date < today) {
    return next({
      status: 400,
      message: "Please select a future date for your reservation.",
    });
  }

  next();
}

function validateTime(req,res,next){
  //checks for input data
  let timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  if(!req.body.data.reservation_time.match(timeFormat)){
      next({
          status: 400,
          message: 'reservation_time must be a valid'
      });
  } else {
      next();
  }
}

function validateOpenResTime(req, res, next) {
  const reservationTime = req.body.data.reservation_time;
  const [hours, minutes] = reservationTime.split(":");
  const reservationDateTime = new Date();
  reservationDateTime.setUTCHours(hours, minutes, 0, 0);

  const openingTime = new Date();
  openingTime.setUTCHours(10, 30, 0, 0); // Sets the opening time to 10:30 AM UTC

  const closingTime = new Date();
  closingTime.setUTCHours(21, 30, 0, 0); // Set the last valid time to 9:30 PM UTC

  if (reservationDateTime < openingTime || reservationDateTime >= closingTime) {
    return next({
      status: 400,
      message: "Please select a reservation time between 10:30 AM and 9:30 PM.",
    });
  }

  next();
}

//--validations for updating status
function validateNewStatus(req, res, next){
  const status = req.body.data.status
  if (status === "booked" || status === "seated" || status === "finished" || status === 'cancelled'){
    next()
  } else {
    next({
      status: 400,
      message: "unknown status"
    })
  }
}

function validateCurrentResStatus(req, res, next){
  const reservation = res.locals.reservation;
  if(reservation.status === "finished"){
    next({
      status: 400,
      message: "a finished reservation cannot be updated"
    });
  } else {
    next();
  }
}

///--------------------------------------------

module.exports = {
  list,
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [
    hasRequiredProperties,
    validateBookedStatus,
    validatePeople,
    validateDate, 
    validateOpenResDate,
    validateTime,
    validateOpenResTime,
    asyncErrorBoundary(create)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validateNewStatus,
    validateCurrentResStatus,
    asyncErrorBoundary(update)
  ],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    validateBookedStatus,
    validatePeople,
    validateDate, 
    validateOpenResDate,
    validateTime,
    validateOpenResTime,
    asyncErrorBoundary(update)
  ]
};
