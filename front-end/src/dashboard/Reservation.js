import React from "react";

function Reservation({data, deleteRes}){
    function tConvert (time) {
        // Check correct time format and split into components
        time = time.slice(0,-3).toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    let newTime = tConvert(data.reservation_time)

    return (
        <tr>
            <td>{data.first_name}</td>
            <td>{data.last_name}</td>
            <td>{data.people}</td>
            <td>{newTime}</td>
            <td>{data.mobile_number}</td>
            <td><button name="delete"
                    className="btn btn-primary dashBrdBtn">✓</button></td>
            <td><button name="delete"
                    className="btn btn-danger dashBrdBtn cancel" 
                    onClick={()=> deleteRes(data)}>	&#10005; </button></td>
        </tr>
   )
    
}

export default Reservation