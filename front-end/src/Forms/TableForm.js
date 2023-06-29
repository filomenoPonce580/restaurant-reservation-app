import React, {useState} from "react";
import {BrowserRouter as Router, useHistory} from "react-router-dom"
import { createTable } from "../utils/api";
import { today } from "../utils/date-time";

function TableForm(){
    const history = useHistory()
    let initialFormData ={
        table_name: '',
        capacity: '',
    }
    const [formData, setFormData] = useState(initialFormData);
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

        const isValidTableName = validateTableName(formData.table_name)
        const isValidCapacity = validateCapacity(formData.capacity)
        // console.log(isValidCapacity)
        // console.log(isValidTableName)

        if(isValidCapacity){
            formData.capacity = Number(formData.capacity);
            console.log(formData)
            //aborts only in useEffects
            const abortController = new AbortController(); //only used in 1 context, if info that loads when visiting component AND its posible to nav away from component, ideally cancel requests
            createTable(formData, abortController.signal)
                .then((savedTable)=>{
                    history.push(`/dashboard?date=${today()}`)
                })
        }
    }

    function validateTableName(nameString){
        //helpers
        function validateTableNumber(tableNumberString){
            let tableNumberCharacters = tableNumberString.split("")
            if(tableNumberCharacters[0]!== "#"){
                setErrorMessage(`Table must begin with "#" of "Bar #".`)
                return false
            } else {
                for(let i = 1; i<tableNumberCharacters.length; i++){
                    const converted = Number(tableNumberCharacters[i])
                    if(isNaN(converted)){
                        setErrorMessage(`Please enter a number after "#" or "Bar#"`)
                        return false
                    }             
                }
            }
            return true
        }

        function validateBar(firstWord){
            if(firstWord === "bar"){
                setErrorMessage('Be sure to include a capital "B" in "Bar".')
                return false
            } else if (firstWord !== "Bar"){
                setErrorMessage("Please enter a table name in the format of #(number) or Bar #(number)")
                return false
            }
            return true
        }

        let nameArray = nameString.split(' ')

        if(!nameString){                                    //empty
            setErrorMessage("Please Enter a Table Name")
            return false
        } else if (nameArray.length === 1){                 //one word(#1)
            validateTableNumber(nameArray[0])
        } else if(nameArray.length === 2){                  //2 words(Bar #1)
            const isValidBar = validateBar(nameArray[0])
            const isValidTableNumber = validateTableNumber(nameArray[1])
            return isValidBar && isValidTableNumber
        } else{                                             //more than 2 words. invalid
            setErrorMessage("Please enter a table name in the format of #(number) or Bar #(number)")
            return false
        }
        return true
    }

    function validateCapacity(capacity){
        function isNumeric(value) {
            return /^\d+$/.test(value);
        }

        if(!isNumeric(capacity) || Number(capacity) <= 0){
            setErrorMessage("Please enter a number greater than 0 for table capacity")
            return false
        }
        return true
    }



    return(
        <Router>
            <h1>Create New Table</h1>

            <form>
                {/* Form Input Fields */}
                {/* Table Name, Capacity */}
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="table_name">Table Name</label>
                        <input 
                            type="text" 
                            className="form-control"
                            name="table_name"
                            id="table_name" 
                            placeholder="#0 or Bar #0"
                            value={formData.table_name} 
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="capacity">Capacity</label>
                        <input 
                            type="text"
                            className="form-control"
                            name="capacity"
                            id="capacity"
                            placeholder="Capacity"
                            value={formData.capacity}
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
                        onClick={() => history.push(`/reservations/new`)}
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
        </Router>
    )
}

export default TableForm