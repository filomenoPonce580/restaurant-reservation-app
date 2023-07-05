import React, {useState} from "react";
import {BrowserRouter, useHistory} from "react-router-dom"
import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import CreateOrEditForm from "./CreateOrEditForm";

function NewResForm(){
    const history = useHistory()

    let initialFormData ={
        first_name: '',
        last_name: '',
        mobile_number: '',
        people: '',
        reservation_date: '',
        reservation_time: ''
    }
    const [formData, setFormData] = useState(initialFormData)
    const [errorMessage, setErrorMessage] = useState("");
  
    function handleInputChange(event){
        event.preventDefault();
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    function handleSubmit(event){
        event.preventDefault()

        //convert party size into number for backend
        formData.people = Number(formData.people)

        //validate date&time.... Date validator calls time validator
        validateDay(formData.reservation_date)

        const abortController = new AbortController()
        createReservation(formData, abortController.signal)
            .then((savedRes) => {
                history.push(`/dashboard?date=${formatAsDate(savedRes.reservation_date)}`)
            })
        return () => abortController.abort()
    }

    function validateDay(dateString){
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
                validateTime(formData.reservation_time)
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
            <h1>Create New Reservation</h1>
            <CreateOrEditForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} history={history} errorMessage={errorMessage}/>
        </React.Fragment>
    )
}

export default NewResForm;