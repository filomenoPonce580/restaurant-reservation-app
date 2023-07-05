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
    const [errorArray, setErrorArray] = useState([])
    let errors = []
  
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

        //validations
        validateDay(formData.reservation_date)
        //validateTime(formData.reservation_time, formData.reservation_date)
        validateMobileNumber(formData.mobile_number)
        checkName(formData.first_name, formData.last_name)
        checkSize(formData.people)
        setErrorArray(errors)

        //if(validateTime(formData.reservation_time, formData.reservation_date) === true){
        if(validateTime(formData.reservation_time, formData.reservation_date) === true){    
            const abortController = new AbortController()
            createReservation(formData, abortController.signal)
                .then((savedRes) => {
                    history.push(`/dashboard?date=${formatAsDate(savedRes.reservation_date)}`)
                })
            return () => abortController.abort()            
        }
    }

    function validateDay(dateString){
        if(!dateString){
            errors.push("Please enter a date")
        }
        //no reservations on tuesday
        const date = new Date(dateString + 'T00:00:00Z'); // Append 'T00:00:00Z' to ensure UTC format
        if (date.getUTCDay() === 2) { // Use getUTCDay() instead of getDay() for UTC-based day
          errors.push(`Sorry, we are closed on Tuesdays. Please select another day`);
        } else {
            //no reservations for previous dates
            const today = new Date()
            today.setUTCHours(0,0,0,0)
            if(date < today){
                errors.push(`Sorry, we can not reserve a table for a past date. Pleas select a future date`)
            } 
            // else{
            //     validateTime(formData.reservation_time, dateString)
            // }
        }
    }

    function validateTime(timeString, dateString){
        if(!timeString){
            errors.push("Please enter a time")
        }
        //access hours&minutes from string
        const [hours, minutes] = timeString.split(":")

        //inject hours/minutes into reservation date object
        const resTime = new Date(dateString)
        resTime.setUTCHours(hours, minutes, 0, 0)

        //set open, last res, and current times
        const openingTime = new Date();
        openingTime.setUTCHours(10, 30, 0, 0)
        const lastResTime = new Date();
        lastResTime.setUTCHours(21, 30, 0, 0)
        const currentTime = new Date()
        currentTime.setHours(currentTime.getHours() - 7);

        //compare values, if invalid set error
        if(resTime < openingTime){
            errors.push(`Please select a valid time. The restaurant opens at 10:30 AM.`)
        } else if (resTime.getHours() > lastResTime.getHours() && resTime.getMinutes() > lastResTime.getMinutes()) {
            errors.push(`Please select a valid time. No reservations after 9:30 PM.`)
        } else if (resTime < currentTime){
            errors.push(`Error: The time you selected has passed.`)
            return false
        }
        return true
    }

    function validateMobileNumber(mobileNumber){
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        if (!regex.test(mobileNumber)){
            errors.push("Please enter a phone number in the following format: 555-555-5555")
        };
    }

    function checkName(firstName, lastName){
        if(!firstName){
            errors.push("Please enter a first name.")
        }
        if(!lastName){
            errors.push("Please enter a last name.")
        }
    }

    function checkSize(size){
        if(!size){
            errors.push("Please enter a size for the party.")
        }
        if(size <= 0){
            errors.push("Please enter a party size greater than 0")
        }
    }

    function renderErrors(array){
        if(array.length > 0){
            array.map(error => {
                return (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>   
                )             
            })

        }
    }

    return(
        <React.Fragment>
            <h1>Create New Reservation</h1>
            <CreateOrEditForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} history={history} errors={errorArray}/>
            {renderErrors(errorArray)}
        </React.Fragment>
    )
}

export default NewResForm;