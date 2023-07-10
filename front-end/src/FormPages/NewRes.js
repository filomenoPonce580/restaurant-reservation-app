import React from "react";
import CreateOrEditForm from "./CreateOrEditForm";

function NewResForm(){
    return(
        <React.Fragment>
            <h1>Create New Reservation</h1>
            <CreateOrEditForm/>
        </React.Fragment>
    )
}

export default NewResForm;