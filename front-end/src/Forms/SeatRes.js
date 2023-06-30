import React, {useState, useEffect} from "react"
import {BrowserRouter, useHistory, useParams} from "react-router-dom"
import { listTables, updateTable } from "../utils/api"
import { today } from "../utils/date-time"

function SeatRes(){
    const { reservationId } = useParams()
    const history = useHistory()

    //placehoder tableData
    // const tableData = [
    //     {"id": 1, table_name: "#1", capacity: 4, status: "Occupied"},
    //     {"id": 2, table_name: "#2", capacity: 8, status: "Free"},
    //     {"id": 3, table_name: "Bar#1", capacity: 2, status: "Free"},
    //     {"id": 4, table_name: "Bar#2", capacity: 3, status: "occupied"}
    // ]
    const [tables, setTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    function loadPage(){
        const abortController = new AbortController();
        setErrorMessage(null);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setErrorMessage)
    }

    useEffect(loadPage, []);

    function handleSelectChange(event){
        setSelectedTableId(event.target.value);
    };

    function handleSubmit(event){
        event.preventDefault();
        setErrorMessage(null);

        //grab selected table data
        const selectedTable = tables.find((table, indx)=>{
            return table.table_id === Number(selectedTableId)
        })

        //PUT request.. on submit, we send api request to /tables/:tableId/seat
        const abortController = new AbortController();
        updateTable( reservationId, selectedTable.table_id, abortController.signal)
            .then(res => {
                history.push(`/dashboard?date=${today()}`)
            })
    }

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <div>
            <h2>Seat Reservation</h2>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="table_id">Table:</label>
                    <select
                        className="form-control"
                        id=""
                        name="table_id"
                        value={selectedTableId}
                        onChange={handleSelectChange}
                        required>
                        <option value="">Select a table</option>
                        {tables.map((table) => (
                            <option key={table.table_id} id={table.table_id} value={table.table_id}>
                            {`${table.table_name} - ${table.capacity}`}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary mr-2" onClick={handleSubmit}>
                    Submit
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                </button>
            </form>
        </div>
      )
}

export default SeatRes








//for later, goes in submit handler
        // Validate the number of people against the selected table's capacity
        // const selectedTableData = tables.find((table) => table.table_id === parseInt(selectedTable));
        // const { capacity } = selectedTableData;
        // const reservationData = {
        // reservation_id: parseInt(reservation_id),
        // table_id: parseInt(selectedTable),
        // };

        // if (selectedTableData && capacity < reservationData.people) {
        // setErrorMessage("Cannot seat the reservation. Table capacity exceeded.");
        // } else {
        // seatReservation(reservationData)
        //     .then(() => {
        //     history.push("/dashboard");
        //     })
        //     .catch((error) => {
        //     setErrorMessage(error.message);
        //     });