import React, {useState} from "react";
import {BrowserRouter as Router, useHistory} from "react-router-dom"

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
    return(
        <React.Fragment>
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
                            placeholder="Table Name"
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
                            value={formData.last_name} onChange={handleInputChange}/>
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
                        >
                        Submit
                    </button>                    
                </div>
            </form>        
        </React.Fragment>
    )
}

export default TableForm