import React, { useState } from 'react';
import DaysColumn from './DaysColumn';

const AppointmentScheduler = ({ moment }) => {
    const[click, setClick] = useState(0);
    let shiftArr= [0,1,2,3,4,5,6];

    const renderDays = (arr) => {
        const newArr = arr.map((i) => {
            if(i + click < 0){
                setClick(0);
                return i;
            }
            return i+click;
        })
        console.log(newArr);
        return newArr.map(index => {
            return(
                <DaysColumn
                    key={(index)}
                    day={moment.clone().add(index, 'days').format('ddd')}
                    month={moment.clone().add(index, 'days').format('MMM')}
                    date={moment.clone().add(index, 'days').format('Do')}
                />
            );
        })
    }

    return(
         <div className="ui ten column grid" style={{ width: "180%", paddingRight: '5px'}}>
             <div 
                className="one wide right aligned column" 
                style={{ marginLeft: '1em', marginTop: '6px', paddingRight:'px', paddingLeft: '0px' }}
            >
                    <i 
                        className="large angle left icon" 
                        onClick={() => setClick(click-7)}
                        style={{ cursor:'pointer' }}
                    />
            </div>
                {renderDays(shiftArr)}
            <div 
                className="one wide left aligned column" 
                style={{ marginTop: '6px', paddingRight:'0px', paddingLeft: '0px' }}
            >
                <i 
                className="large angle right icon" 
                onClick={() => setClick(click+7)}
                style={{ cursor: 'pointer'}} 
            />
            </div>
        </div>
    );
}

export default AppointmentScheduler;