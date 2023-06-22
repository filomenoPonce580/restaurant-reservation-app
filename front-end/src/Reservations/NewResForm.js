import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Link, useHistory} from "react-router-dom"

function NewResForm(){
    return(
        <React.Fragment>
            <form>

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="first_name">First Name</label>
                        <input type="text" class="form-control" id="first_name" placeholder="First Name"/>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="last_name">Last Name</label>
                        <input type="text" class="form-control" id="last_name" placeholder="Last Name"/>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-4">
                        <label for="mobile_number">Mobile Number</label>
                        <input type="text" class="form-control" id="mobile_number" placeholder="555-555-5555"/>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="reservation_date">Reservation Date</label>
                        <input type="date" class="form-control" id="reservation_date" placeholder=""/>
                    </div>
                    <div class="form-group col-md-4">
                        <label for="reservation_time">Reservation Time</label>
                        <input type="time" class="form-control" id="reservation_time" min="11:00" max="22:00"/>
                    </div>
                </div>

                <div class="form-group">
                    <Link to={"/"}><button class="btn btn-secondary m-1"> Cancel</button></Link>
                    <button type="submit" class="btn btn-primary m-1">Submit</button>                    
                </div>
            </form>        
        </React.Fragment>
    )

}

export default NewResForm;
