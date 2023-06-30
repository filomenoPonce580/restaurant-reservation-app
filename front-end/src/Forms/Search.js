import React, {useState, useEffect} from "react"
//import {BrowserRouter} from "react-router-dom"
import { listReservations } from "../utils/api";
import Reservation from "../dashboard/Reservation";

function Search({mobile_number}){
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    useEffect(loadSearchPage, [mobile_number]);

    function loadSearchPage() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ mobile_number }, abortController.signal)
          .then(setReservations)
          .catch(setReservationsError);
        return () => abortController.abort();
    }

    if (reservationsError)console.log(reservationsError)

    function loadReservations(){
        return (
            <div>                
                <h1 className="title">Reservations</h1>

                <div className="">
                    <table>
                    <thead className="tableHead">
                        <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Party Size</th>
                        <th>Time</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((oneRes, indx) => <Reservation key={indx} reservation={oneRes} deleteRes={deleteRes}/>)}
                    </tbody>
                    </table>
                </div>
            </div>
        )
    }

    function noReservationsMessage(){
        return (
            <div className="d-flex justify-content-center">
                <span>No reservations found</span>
            </div>
        )
    }

    console.log(reservations)


    function handleSubmit(){
        console.log('success')
    }

    //no function right now(not connected to server)
    function deleteRes(resToDelete){
        let filteredRes = reservations.filter(res => res !== resToDelete);
        setReservations(filteredRes)
    }
    return (
        <div>
            <h1 className="title mb-3">Search</h1> 

            <form className="" onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center">
                    <input
                    className="form-control w-50"
                    type="search"
                    id="mobile_number"
                    name="mobile_number"
                    placeholder="Enter a customer's phone number" />
                    <button type="submit" className="btn btn-primary mr-2" onClick={handleSubmit}>Find</button>
                </div>
            </form>

            {reservations.length > 0 ? loadReservations() : noReservationsMessage()}
        </div>
        
    )
}

export default Search