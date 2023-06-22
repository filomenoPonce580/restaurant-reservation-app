import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "./Reservation";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function deleteRes(resToDelete){
    let filteredRes = reservations.filter(res => res !== resToDelete);
    setReservations(filteredRes)
  }
  
  console.log(reservations)
  function sortReservationsByTime(array){
    return array.sort((a,b)=>{
        return a.reservation_time.localeCompare(b.reservation_time)
    })
  }
  let sortedRes = sortReservationsByTime(reservations)
  return (
    <main>
      <h1 className="title">Dashboard</h1>
      <div className=" mb-3 title">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />

      <div className="recipe-list">
        <table>
          <thead className="tableHead">
            
              <th>First Name</th>
              <th>Last Name</th>
              <th>Party Size</th>
              <th>Time</th>
              <th>Phone</th>
              <th>Action</th>

          </thead>
          <tbody>
              {sortedRes.map((oneRes, indx) => <Reservation key={indx} data={oneRes} deleteRes={deleteRes}/>)}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
