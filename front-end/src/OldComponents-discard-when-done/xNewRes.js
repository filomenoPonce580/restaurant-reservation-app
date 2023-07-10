import React, {useState} from "react";
import {BrowserRouter, useHistory} from "react-router-dom"
import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import CreateOrEditForm from "./xCreateOrEditForm";

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
        let fireAPI = true
        if(!validateDateTime(formData.reservation_date, formData.reservation_time))fireAPI = false
        if(!validateMobileNumber(formData.mobile_number))fireAPI = false
        if(!checkName(formData.first_name, formData.last_name))fireAPI = false
        if(!checkSize(formData.people)) fireAPI = false
        setErrorArray(errors)

        if(fireAPI){
            const abortController = new AbortController()
            createReservation(formData, abortController.signal)
                .then((savedRes) => {
                    history.push(`/dashboard?date=${formatAsDate(savedRes.reservation_date)}`)
                })
            return () => abortController.abort()              
        }
    }

    function validateDateTime (dateString, timeString){
        let isValid = true

        if(!dateString){
            errors.push("Please enter a date")
            isValid = false
        }
        if(!timeString){
            errors.push("Please enter a time")
            isValid = false
        }

        const resDate = new Date(`${dateString}T${timeString}`)
        if (resDate.toDateString().slice(0,3) === "Tue") {
            errors.push(`Sorry, we are closed on Tuesdays. Please select another day`);
            isValid = false
        }

        const openingTime = new Date();
        openingTime.setUTCHours(17, 30, 0, 0)
        const lastResTime = new Date();
        lastResTime.setUTCHours(21, 30, 0, 0)
        lastResTime.setHours(lastResTime.getHours() + 7)
        const currentTime = new Date()
        currentTime.setHours(currentTime.getHours() - 0);

        if(resDate < currentTime){
            errors.push(`You have set the reservation for a prior date or time. Please enter a future date or time`)
            isValid = false
        } else if (resDate.getHours() + Number("0." + resDate.getMinutes()) > lastResTime.getHours() + Number("0." + lastResTime.getMinutes())){
            errors.push(`Please select a valid time. No reservations after 9:30 PM.`)
            isValid = false
        } else if(resDate.getHours() + Number("0." + resDate.getMinutes()) < openingTime.getHours() + Number("0." + openingTime.getMinutes())){
            errors.push(`Please select a valid time. The restaurant opens at 10:30 AM.`)
            isValid = false
        }
  
        return isValid  
    }

    function validateMobileNumber(mobileNumber){
        let isValid = true
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        if (!regex.test(mobileNumber)){
            errors.push("Please enter a phone number in the following format: 555-555-5555")
            isValid = false
        };
        return isValid
    }

    function checkName(firstName, lastName){
        let isValid = true
        if(!firstName){
            errors.push("Please enter a first name.")
            isValid = false
        }
        if(!lastName){
            errors.push("Please enter a last name.")
            isValid = false
        }
        return isValid
    }

    function checkSize(size){
        let isValid = true
        //console.log(!size)
        if(!size){
            errors.push("Please enter a number into the Party Size field.")
            isValid = false
        }
        if(size <= 0){
            errors.push("Please enter a party size greater than 0")
            isValid = false
        }
        return isValid
    }

    return(
        <React.Fragment>
            <h1>Create New Reservation</h1>
            <CreateOrEditForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} history={history} errors={errorArray}/>
        </React.Fragment>
    )
}

export default NewResForm;