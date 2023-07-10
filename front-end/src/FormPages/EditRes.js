import React from "react";
import {useParams} from "react-router-dom";
import CreateOrEditForm from "./CreateOrEditForm";

function EditRes(){
    const { reservationId } = useParams()
    return(
        <React.Fragment>
            <h1>Edit Reservation</h1>
            <CreateOrEditForm reservationId={reservationId}/>
        </React.Fragment>
    )
}

export default EditRes