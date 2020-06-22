import React from 'react';

const AppointmentScheduler = (props) => {
    console.log(props.current);
    return(
         <div>
            Appointment Scheduler
            <p>The date now is: {props.current}</p>
        </div>
    );
}

export default AppointmentScheduler;