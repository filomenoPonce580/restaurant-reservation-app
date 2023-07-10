import React from "react";
import {BrowserRouter as Router} from "react-router-dom"

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import TableForm from "../FormPages/TableForm";
import SeatRes from "../FormPages/SeatRes";
import Search from "../FormPages/Search";
import useQuery from "../utils/useQuery";

import NewResForm from "../FormPages/NewRes";
import EditRes from "../FormPages/EditRes";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {

  const query = useQuery();
  const date = query.get("date")
  const mobile_number = query.get("mobile_number")

  return (
    <Switch>

      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date ? date : today()} />
      </Route>

      <Route path="/reservations/new">
        <NewResForm />
      </Route>

      <Route path="/tables/new">
        <TableForm />
      </Route>

      <Route path="/reservations/:reservationId/seat">
        <SeatRes />
      </Route>

      <Route path="/reservations/:reservationId/edit">
        <EditRes />
      </Route>

      <Route path="/search">
        <Search mobile_number={mobile_number}/>
      </Route>

      <Route>
        <NotFound />
      </Route>

    </Switch>
  );
}

export default Routes;
