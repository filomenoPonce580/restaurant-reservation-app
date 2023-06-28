import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "./Reservation";
import Table from "./Table";
import {BrowserRouter as Router, Route, Link, Switch, useHistory, useLocation, useRouteMatch, useParams} from "react-router-dom"
import { previous, next, today } from "../utils/date-time";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
    return () => abortController.abort();
  }

  function deleteRes(resToDelete){
    let filteredRes = reservations.filter(res => res !== resToDelete);
    setReservations(filteredRes)
  }

  // console.log("T: ", typeof tables[0].capacity)
  // console.log("R: ", typeof reservations[0].people)

  return (
    <main>
      <h1 className="title">Dashboard</h1>
      <div className=" mb-3 title">
        <h4 className="mb-0">Reservations for date {date}</h4>


              <form>
                <div className="form-group">
                    <Link to={`/dashboard?date=${previous(date)}`}><button className="btn btn-secondary m-1"> Previous </button></Link>
                    <Link to={`/dashboard?date=${today()}`}><button className="btn btn-secondary m-1 dashBrdBtn">Today</button></Link>
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

      <h1 className="title">Tables</h1>
      <ErrorAlert error={tablesError} />
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
              {tables.map((oneTable, indx) => <Table key={indx} data={oneTable}/>)}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
