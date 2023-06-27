import React from "react";

function Table({data}){

    return (
        <tr>
            <td>{data.table_name}</td>
            <td>{data.occupancy}</td>
            <td data-table-id-status={data.table_id}>
                {data.status === "Occupied" ? "Occupied" : "Free"}
            </td>
        </tr>
   )
    
}

export default Table