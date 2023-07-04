import React, {useState, useEffect} from "react";
import {BrowserRouter, useHistory, useParams} from "react-router-dom";
import { updateReservation, readReservation } from "../utils/api";
import { formatAsTime } from "../utils/date-time";

function EditRes(){
    const { reservationId } = useParams()
    const history = useHistory()

    let initialFormData ={
        first_name: '',
        last_name: '',
        mobile_number: '',
        people: '',
        reservation_date: '',
        reservation_time: ''
    }
    const [reservation, setReservation] = useState([])
    const [formData, setFormData] = useState(initialFormData)
    const [errorMessage, setErrorMessage] = useState("");

    function loadRes() {
      const abortController = new AbortController();
      readReservation(reservationId, abortController.signal)
        .then(setReservation)
        .catch(err=>{
            throw err
        })
      return () => abortController.abort();
    }

    useEffect(loadRes, []);

    function handleInputChange(event){
        event.preventDefault();
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    function handleSubmit(event){
        event.preventDefault()

        const nonEmptyFormData = Object.entries(formData).reduce((acc, [key, value]) => {
            if (value !== '') {
              acc[key] = value;
            }
            return acc;
          }, {});
        
          const updatedReservationObj = {
            ...reservation,
            ...nonEmptyFormData
        };

        //reformat People, and res times for backend
        updatedReservationObj.reservation_time = formatAsTime(updatedReservationObj.reservation_time)
        if(typeof updatedReservationObj.people === "string"){
            updatedReservationObj.people = Number(updatedReservationObj.people)
        }

        validateDateTime(updatedReservationObj.reservation_date, formData.reservation_time)

        updateReservation(updatedReservationObj)
            .then((updatedRes)=>{
                console.log(updatedRes)
                history.push(`/dashboard?date=${updatedReservationObj.reservation_date}`)
            })
    }

    function validateDateTime(dateString, timeString){
        //no reservations on tuesday
        const date = new Date(dateString + 'T00:00:00Z'); // Append 'T00:00:00Z' to ensure UTC format
        if (date.getUTCDay() === 2) { // Use getUTCDay() instead of getDay() for UTC-based day
          setErrorMessage(`Sorry, we are closed on Tuesdays. Please select another day`);
        } else {
            //no reservations for previous dates
            const today = new Date()
            today.setUTCHours(0,0,0,0)
            if(date < today){
                setErrorMessage(`Sorry, we can not reserve a table for a past date. Pleas select a future date`)
            }else{
                validateTime(timeString)
            }
        }

    }

    function validateTime(timeString){
        //access hours&minutes from string
        const [hours, minutes] = timeString.split(":")

        //inject hours/minutes into new date object
        const resTime = new Date();
        resTime.setUTCHours(hours, minutes, 0, 0)

        //set open, last res, and current times
        const openingTime = new Date();
        openingTime.setUTCHours(10, 30, 0, 0)
        const lastResTime = new Date();
        lastResTime.setUTCHours(21, 30, 0, 0)
        const currentTime = new Date()

        //compare values, if invalid set error
        if(resTime < openingTime || resTime > lastResTime || resTime < currentTime){
            setErrorMessage(`Please select a valid time. Reservations are open from 10:30 AM to 9:30 PM.`)
        }
    }

    return(
        <React.Fragment>
            <h1>Edit Reservation</h1>

            <form>
                {/* Form Input Fields */}
                {/* Top Row: First & Last Names, Phone# */}
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="first_name">First Name</label>
                        <input 
                            type="text" 
                            className="form-control"
                            name="first_name"
                            id="first_name" 
                            placeholder={reservation.first_name}
                            value={formData.first_name} 
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="last_name">Last Name</label>
                        <input 
                            type="text"
                            className="form-control"
                            name="last_name"
                            id="last_name"
                            placeholder={reservation.last_name}
                            value={formData.last_name} onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="mobile_number">Mobile Number</label>
                        <input
                            type="text"
                            className="form-control" 
                            name="mobile_number"
                            id="mobile_number" 
                            placeholder={reservation.mobile_number}
                            value={formData.mobile_number}
                            onChange={handleInputChange}/>
                    </div>
                </div>

                {/* Bottom Row: PartySize(people) & Date, Time# */}
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="people">Party Size</label>
                        <input
                            type="text"
                            className="form-control"
                            name="people"
                            id="people"
                            placeholder={reservation.people}
                            value={formData.people}
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="reservation_date">Reservation Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="reservation_date"
                            id="reservation_date"
                            value={formData.reservation_date}
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="reservation_time">Reservation Time</label>
                        <input
                            type="time"
                            className="form-control"
                            name="reservation_time"
                            id="reservation_time"
                            min="09:00"
                            max="22:00"
                            
                            onChange={handleInputChange}/>
                    </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                {/* Cancel & submit buttons */}
                <div className="form-group">
                    <button 
                        className="btn btn-secondary m-1"
                        onClick={() => history.push('/')}
                        > 
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary m-1"
                        onClick={handleSubmit}
                        >
                        Submit
                    </button>                    
                </div>
            </form>        
        </React.Fragment>
    )
}

export default EditRes