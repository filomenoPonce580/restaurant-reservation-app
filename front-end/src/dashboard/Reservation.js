import React from "react";
import {BrowserRouter as Router, Link} from "react-router-dom"


function Reservation({reservation, deleteRes}){
    function tConvert (time) {
        // Check correct time format and split into components
        time = time.slice(0,-3).toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) {                      // If time format correct
          time = time.slice (1);                    // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM';    // Set AM/PM
          time[0] = +time[0] % 12 || 12;            // Adjust hours
        }
        return time.join('');                       // return adjusted time or original string
    }

    let newTime = tConvert(reservation.reservation_time)

    const reservation_id = reservation.reservation_id

    function checkStatus(status){
        if(status === 'booked'){
            return (
                <td>
                <Link to={`/reservations/${reservation_id}/seat`}> 
                    <button 
                        name="seat"
                        className="btn btn-primary dashBrdBtn">
                        Seat    
                    </button>                                            
                </Link>
            </td>
            )
        } else if (status === 'seated') {
            return (
                <td>
                    <button name="delete"
                        className="btn btn-danger dashBrdBtn cancel" 
                        onClick={()=> deleteRes(reservation)}>	
                        Dining 
                    </button>
                </td>
            )
        }
    }

    return (
        <tr>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.people}</td>
            <td>{newTime}</td>
            <td>{reservation.mobile_number}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
            {checkStatus(reservation.status)}
        </tr>
   )
    
}

export default Reservation