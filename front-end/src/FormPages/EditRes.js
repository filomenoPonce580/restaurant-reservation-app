import React, {useState, useEffect} from "react";
import {BrowserRouter, useHistory, useParams} from "react-router-dom";
import { updateReservation, readReservation } from "../utils/api";
import { formatAsTime } from "../utils/date-time";
import CreateOrEditForm from "./CreateOrEditForm";

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
    const [errorArray, setErrorArray] = useState([])
    let errors = []

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
        validateMobileNumber(updatedReservationObj.mobile_number)
        checkSize(updatedReservationObj.people)
        setErrorArray(errors)

        const abortController = new AbortController();
        updateReservation(updatedReservationObj, abortController.signal)
            .then((updatedRes)=>{
                history.push(`/dashboard?date=${updatedReservationObj.reservation_date}`)
            })
        return () => abortController.abort();
    }

    function validateDateTime(dateString, timeString){
        //no reservations on tuesday
        const date = new Date(dateString + 'T00:00:00Z');               // Append 'T00:00:00Z' to ensure UTC format
        if (date.getUTCDay() === 2) {                                   // Use getUTCDay() instead of getDay() for UTC-based day
          errors.push(`Sorry, we are closed on Tuesdays. Please select another day`);
        } else {//no reservations for previous dates
            const today = new Date()
            today.setUTCHours(0,0,0,0)
            if(date < today){
                errors.push(`Sorry, we can not reserve a table for a past date. Pleas select a future date`)
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
            errors.push(`Please select a valid time. Reservations are open from 10:30 AM to 9:30 PM.`)
        }
    }

    function validateMobileNumber(mobileNumber){
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        if (!regex.test(mobileNumber)){
            errors.push("Please enter a phone number in the following format: 555-555-5555")
        };
    }

    function checkSize(size){
        if(size <= 0){
            errors.push("Please enter a party size greater than 0")
        }
    }

    return(
        <React.Fragment>
            <h1>Edit Reservation</h1>
            <CreateOrEditForm reservation={reservation} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} history={history} errors={errorArray}/>
        </React.Fragment>
    )
}

export default EditRes