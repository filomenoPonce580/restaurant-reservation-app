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

        let isValid = true
        // validateDateTime(updatedReservationObj.reservation_date, formData.reservation_time)
        if(!validateMobileNumber(updatedReservationObj.mobile_number)) isValid = false
        if(!validateDateTime(updatedReservationObj.reservation_date, updatedReservationObj.reservation_time)) isValid = false
        if(!checkSize(updatedReservationObj.people)) isValid = false
        setErrorArray(errors)

        if(isValid){
            const abortController = new AbortController();
            updateReservation(updatedReservationObj, abortController.signal)
                .then((updatedRes)=>{
                    history.push(`/dashboard?date=${updatedReservationObj.reservation_date}`)
                })
            return () => abortController.abort();
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

    function checkSize(size){
        let isValid = true
        if(size <= 0){
            errors.push("Please enter a party size greater than 0")
            isValid = false
        }
        return isValid
    }

    return(
        <React.Fragment>
            <h1>Edit Reservation</h1>
            <CreateOrEditForm reservation={reservation} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} history={history} errors={errorArray}/>
        </React.Fragment>
    )
}

export default EditRes