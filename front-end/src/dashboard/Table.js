import React from "react";

function Table({data}){

    return (
        <tr>
            <td>{data.table_name}</td>
            <td>{data.capacity}</td>
            <td data-table-id-status={data.table_id}>
                {!data.reservation_id ? "Free" : "Occupied"}
            </td>
        </tr>
   )
    
}

export default Table