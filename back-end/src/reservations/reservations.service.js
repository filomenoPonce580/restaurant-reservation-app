const knex = require("../db/connection");

function read(reservationId){
  return knex("reservations")
    .where({reservation_id: reservationId})
    .first();
}

function list(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({reservation_date})
    .orderBy("reservation_time")
}

function create(res) {
  return knex("reservations")
    .insert(res)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*");
}

module.exports = {
  list,
  create,
  read,
  update
};