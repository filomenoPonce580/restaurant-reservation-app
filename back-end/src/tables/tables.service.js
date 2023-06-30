const knex = require("../db/connection");

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
};

function create(table) {
    return knex("tables")
      .insert(table)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
};

function read(tableId){
    return knex("tables")
        .select("*")
        .where({table_id: tableId})
        .first();
};

function update(updatedTable){
    return knex("tables")
        .select("*")
        .where({table_id: updatedTable.table_id})
        .update(updatedTable, "*");
};

function destroy(tableId) {
    return knex("tables").where({table_id: tableId}).del();
}

module.exports = {
    list,
    create,
    read,
    update,
    delete: destroy
};