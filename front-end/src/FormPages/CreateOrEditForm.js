import Error from "./Errors"

function CreateOrEditForm({reservation, formData, handleInputChange, handleSubmit, errorMessage, history, errors}){
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
                            placeholder={reservation ? reservation.first_name : "First Name"}
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
                            placeholder={reservation ? reservation.last_name : "Last Name"}
                            value={formData.last_name} onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="mobile_number">Mobile Number</label>
                        <input
                            type="text"
                            className="form-control" 
                            name="mobile_number"
                            id="mobile_number" 
                            placeholder={reservation ? reservation.mobile_number : "555-555-5555"}
                            value={formData.mobile_number}
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
                            placeholder={reservation ? reservation.people : "Party Size"}
                            value={formData.people}
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="reservation_date">{reservation ? `New Date (if applicable)` : 'Reservation Date'}</label>
                        <input
                            type="date"
                            className="form-control"
                            name="reservation_date"
                            id="reservation_date"
                            value={formData.reservation_date}
                            onChange={handleInputChange}/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="reservation_time">{reservation ? `New Time (if applicable)` : 'Reservation Time'}</label>
                        <input
                            type="time"
                            className="form-control"
                            name="reservation_time"
                            id="reservation_time"
                            min="09:00"
                            max="22:00"
                            
                            onChange={handleInputChange}/>
                    </div>
                </div>

                {/* Error messages */}
                {errors && errors.map(oneError=> <Error oneError={oneError} key={oneError}/>)}

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