// //
// function handleSubmit(event){
//     event.preventDefault()

//     //convert party size into number for backend
//     formData.people = Number(formData.people)

//     //validate date&time.... Date validator calls time validator
//     validateDay(formData.reservation_date, formData.reservation_time)

//     //console.log("day/time validate exited")

//     console.log("form data: ", formData)

//     const updatedReservationObj = {
//         // ...reservation,
//         ...formData,
//         reservation_id: Number(reservationId),
//         status: "booked"
//     }
//     console.log("updated: ", updatedReservationObj)

//     updateReservation(updatedReservationObj)
//         .then((updatedRes)=>{
//             console.log("updated res after API call",updatedRes)
//             history.push(`/`)
//         })
// }

// function validateDay(dateString, timeString){
//     console.log("validate day called")
//     console.log("TEST",dateString, timeString)
//     //no reservations on tuesday
//     //const date = new Date(dateString + 'T00:00:00Z'); // Append 'T00:00:00Z' to ensure UTC format
//     const day = new Date(dateString).getUTCDay()
//     const errors = []

//     if (day === 2) { // Use getUTCDay() instead of getDay() for UTC-based day
//       //setErrorMessage(`Sorry, we are closed on Tuesdays. Please select another day`);
//       errors.push(new Error(`Sorry, we are closed on Tuesdays. Please select another day`))
//     } 

//     //no reservations in past date
//     const formattedDate = new Date(`${dateString}T${timeString}`)
//     if(formattedDate < new Date()){
//         errors.push(new Error(`Sorry, we can not reserve a table for a past date. Pleas select a future date`))
//     }

//     //no reservations befor 10:30am or after 9:30 pm
//     //is res before?
//     if(){

//     }

//     //is res after?







    
//     if (date < today){
//         //no reservations for previous dates
//         const today = new Date()
//         today.setUTCHours(0,0,0,0)
//         if(date < today){
//             //setErrorMessage(`Sorry, we can not reserve a table for a past date. Pleas select a future date`)
//             errors.push(new Error(`Sorry, we can not reserve a table for a past date. Pleas select a future date`))
//         }else{
//             // const timeString = formData.reservation_time

//             //access hours&minutes from string
//             const [hours, minutes] = timeString.split(":")

//             //inject hours/minutes into new date object
//             const resTime = new Date();
//             resTime.setUTCHours(hours, minutes, 0, 0)

//             //No reservations before 10:30AM or after 9:30PM
//             const openingTime = new Date();
//             openingTime.setUTCHours(10, 30, 0, 0)           //sets open to 10:30AM
//             const lastResTime = new Date();
//             lastResTime.setUTCHours(21, 30, 0, 0)           //sets last res to 9:30PM
//             const currentTime = new Date()                  //creates current time variable

//             console.log("Reservation: hour, minute, combined: ", hours, minutes, resTime)
//             console.log("open", openingTime)
//             console.log("close", lastResTime)
//             //compare values, if invalid set error
//             if(resTime < openingTime || resTime > lastResTime || resTime < currentTime){
//                 //setErrorMessage(`Please select a valid time. Reservations are open from 10:30 AM to 9:30 PM.`)
//                 errors.push(new Error(`Please select a valid time. Reservations are open from 10:30 AM to 9:30 PM.`))
//             }

//         }
//     }
//     return errors
// }

// // function validateTime(timeString){

// // }