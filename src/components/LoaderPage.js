import React from 'react';

const LoaderPage = props => {
    return (
        <div className="ui active dimmer">
            <div className="ui big text loader">
                {props.message}
            </div>
        </div>
    );
};

LoaderPage.defaultProps =  {
    message: 'Loading...'
}

export default LoaderPage;