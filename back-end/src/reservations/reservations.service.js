const knex = require("../db/connection");

function list(reservation_date) {
  //console.log(reservation_date)
    return knex("reservations")
      .select("*")
      .where({reservation_date})
      .orderBy("reservation_time")
}

function create(res) {
    //your solution here
    return knex("reservations")
      .insert(res)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
  }

module.exports = {
    list,
    create
    //read,
};