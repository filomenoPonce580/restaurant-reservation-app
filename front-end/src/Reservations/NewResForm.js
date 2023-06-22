import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Link, useHistory} from "react-router-dom"

function NewResForm(){
    return(
        <React.Fragment>
            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        placeholder="Deck Name" 
                        />
                    <label htmlFor="description"></label>
                    Description
                    <textarea 
                        type="text"
                        name="description"
                        id="description" 
                        placeholder="Description"
                        ></textarea>
                </div>
                <Link to={"/"}><button>Cancel</button></Link>
                <button>Submit</button>
            </form>
                
        </React.Fragment>
    )

}

export default NewResForm;
