import React from 'react';

import './Button.scss';

export default (props) => {

    const classes = ['button'];

    // Changing Style
    props.secondary && classes.push('button--sec')
    props.small     && classes.push('button--small');
    props.color     && classes.push('button--secondary-color');
    
    return <button 
                type="button" 
                onClick={props.onTrigger} 
                className={classes.join(' ')}>
            {props.title}
        </button>
};