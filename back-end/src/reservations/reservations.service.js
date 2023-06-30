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

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
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
  update,
  search
};