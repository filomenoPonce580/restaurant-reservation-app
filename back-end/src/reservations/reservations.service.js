const knex = require("../db/connection");

async function list(reservation_date) {
  //console.log(reservation_date)
    return knex("reservations")
      .select("*")
      // .where({reservation_date})
}

async function create(res) {
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