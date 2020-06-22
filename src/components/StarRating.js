import React from 'react';
//import { FaStar } from 'react-icons/fa';
import './App.css';

const StarRating = ({ starId, rating, onMouseEnter, onMouseLeave, onClick }) =>{
    let styleClass = 'star-rating-blank';
    if(rating && rating >= starId){
        styleClass = 'star-rating-filled';
    }

    //rating prop will determine the number
    //console.log(rating);

    return(
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            <svg className={styleClass} height="35px" width="33px" viewBox="0 0 20 23">
                <polygon 
                    strokeWidth="0"
                    points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
                />
            </svg>
        </div>
    );
}

export default StarRating;