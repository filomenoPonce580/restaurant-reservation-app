import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Link, useHistory} from "react-router-dom"
import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";

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
  
    function handleInputChange(event){
        event.preventDefault();
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    function handleSubmit(event){
        event.preventDefault()
        const abortController = new AbortController()
        createReservation(formData, abortController.signal)
            .then((savedRes) => {
                history.push(`/dashboard?date=${formatAsDate(savedRes.reservation_date)}`)
            })
        return () => abortController.abort()
    }


    return(
        <React.Fragment>
            <h1>Create New Reservation</h1>

            <form onSubmit={handleSubmit}>

                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="first_name">First Name</label>
                        <input 
                            type="text" 
                            className="form-control"
                            name="first_name"
                            id="first_name" 
                            placeholder="First Name"
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
                            placeholder="Last Name"
                            value={formData.last_name} onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="mobile_number">Mobile Number</label>
                        <input
                            type="text"
                            className="form-control" 
                            name="mobile_number"
                            id="mobile_number" 
                            placeholder="555-555-5555"
                            value={formData.mobile_number}
                            onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="people">Party Size</label>
                        <input
                            type="text"
                            className="form-control"
                            name="people"
                            id="people"
                            placeholder="2"
                            value={Number(formData.people)}
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="reservation_date">Reservation Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="reservation_date"
                            id="reservation_date"
                            placeholder=""
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
                            min="11:00"
                            max="22:00"
                            
                            onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="form-group">
                    <button className="btn btn-secondary m-1" onClick={() => history.goBack()}> Cancel</button>
                    <button type="submit" className="btn btn-primary m-1" onClick={handleSubmit}>Submit</button>                    
                </div>
            </form>        
        </React.Fragment>
    )

}

export default NewResForm;
