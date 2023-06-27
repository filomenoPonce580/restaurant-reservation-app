import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "./Reservation";
import Table from "./Table";
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

  //placehoder tableData
  const tableData = [
    {"id": 1, table_name: "#1", capacity: 4, status: "Occupied"},
    {"id": 2, table_name: "#2", capacity: 8, status: "Free"},
    {"id": 3, table_name: "Bar#1", capacity: 2, status: "Free"},
    {"id": 4, table_name: "Bar#2", capacity: 3, status: "occupied"}
  ]


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

      <div className="">
        <table>
          <thead className="tableHead">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Party Size</th>
              <th>Time</th>
              <th>Phone</th>
              <th>Seat</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
              {reservations.map((oneRes, indx) => <Reservation key={indx} data={oneRes} deleteRes={deleteRes}/>)}
          </tbody>
        </table>
      </div>

      <h1>Tables</h1>
      <div className="">
        <table>
          <thead className="tableHead">
            <tr>
              <th>Table Name</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
              {tableData.map((oneTable, indx) => <Table key={indx} data={oneTable}/>)}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
