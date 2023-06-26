import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "./Reservation";
import {BrowserRouter as Router, Route, Link, Switch, useHistory, useLocation, useRouteMatch, useParams} from "react-router-dom"
import { previous, next } from "../utils/date-time";


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
      //console.log(reservations)
    return () => abortController.abort();
  }

  function deleteRes(resToDelete){
    let filteredRes = reservations.filter(res => res !== resToDelete);
    setReservations(filteredRes)
  }

  return (
    <main>
      <h1 className="title">Dashboard</h1>
      <div className=" mb-3 title">
        <h4 className="mb-0">Reservations for date {date}</h4>


              <form>
                <div className="form-group">
                    <Link to={`/dashboard?date=${previous(date)}`}><button className="btn btn-secondary m-1"> Previous </button></Link>
                    <Link to={`/dashboard?date=${date}`}><button className="btn btn-secondary m-1 dashBrdBtn">Today</button></Link>
                    <Link to={`/dashboard?date=${next(date)}`}><button className="btn btn-secondary m-1 dashBrdBtn">Next</button></Link>                   
                </div>
              </form>  


        
      </div>
      <ErrorAlert error={reservationsError} />

      <div className="recipe-list">
        <table>
          <thead className="tableHead">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Party Size</th>
              <th>Time</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
              {reservations.map((oneRes, indx) => <Reservation key={indx} data={oneRes} deleteRes={deleteRes}/>)}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
