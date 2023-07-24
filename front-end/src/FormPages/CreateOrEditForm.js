import Error from "./Errors"
import React, {useState, useEffect} from "react";
import {BrowserRouter, useHistory} from "react-router-dom"
import { updateReservation, readReservation, createReservation } from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time";

function CreateOrEditForm({reservationId}){
    const history = useHistory()
    let initialFormData = {
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
    
    function loadRes() {
        if(reservationId){
            const abortController = new AbortController();
                readReservation(reservationId, abortController.signal)
                    .then(setFormData)
                    .catch(err=>{
                        throw err
                    })
            return () => abortController.abort();            
        } else {
            console.log("No resID, landed on create Page")
        }
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

        formData.people = Number(formData.people)
        if(formData.reservation_time){
            formData.reservation_time = formatAsTime(formData.reservation_time) 
        } 

        let fireAPI = true
        if(!validateDateTime())fireAPI = false
        if(!validateMobileNumber(formData.mobile_number))fireAPI = false
        if(!checkName(formData.first_name, formData.last_name))fireAPI = false
        if(!checkSize(formData.people)) fireAPI = false
        setErrorArray(errors)

        if(fireAPI && !reservationId){
            const abortController = new AbortController()
            createReservation(formData, abortController.signal)
                .then((savedRes) => {
                    history.push(`/dashboard?date=${formatAsDate(savedRes.reservation_date)}`)
                })
            return () => abortController.abort()              
        } else if(fireAPI && reservationId){
            const abortController = new AbortController();
            updateReservation(formData, abortController.signal)
               .then((updatedRes)=>{
                   history.push(`/dashboard?date=${formatAsDate(updatedRes.reservation_date)}`)
               })
            return () => abortController.abort();
        }  
        
  
    }

    const closedDay = [2]
    function convertISOTimeToMinutes(time) { 
        const result = time.split(":").map((part) => parseInt(part));
        return result[0] * 60 + result[1];
    }

    function validateDateTime (){
        let isValid = true

        if(!formData.reservation_date){
            errors.push("Please enter a date")
            isValid = false
        }
        if(!formData.reservation_time){
            errors.push("Please enter a time")
            isValid = false
        }

        const testDate = new Date(formData.reservation_date).getUTCDay()
        if (closedDay.includes(testDate)) {
            errors.push(`Sorry, we are closed on Tuesdays. Please select another day`);
            isValid = false
        }

        const resTime = convertISOTimeToMinutes(formData.reservation_time)
        if(resTime < 630 || resTime > 1290){
            errors.push('Please select a time between 10:30am and 9:30pm.')
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

    return (
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
                            value={formData ? formData.first_name : ""} 
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="last_name">Last Name</label>
                        <input 
                            type="text"
                            className="form-control"
                            name="last_name"
                            id="last_name"
                            value={formData ? formData.last_name : ''} 
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="mobile_number">Mobile Number</label>
                        <input
                            type="text"
                            className="form-control" 
                            name="mobile_number"
                            id="mobile_number" 
                            value={formData ? formData.mobile_number: ''}
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

                            value={formData ? formData.people : ''}
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="reservation_date">Reservation Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="reservation_date"
                            id="reservation_date"
                            value={formData ? formData.reservation_date : ''}
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
                            value={formData ? formData.reservation_time : ''}
                            
                            onChange={handleInputChange}/>
                    </div>
                </div>

                {/* Error messages */}
                {errorArray && errorArray.map(oneError=> <Error oneError={oneError} key={oneError}/>)}

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
    )
}

export default CreateOrEditForm