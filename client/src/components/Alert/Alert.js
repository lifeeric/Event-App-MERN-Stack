import React from 'react';
import soundError from '../../helper/sound.hel';

import errorSound from '../../assests/error.mp3';
import successSound from '../../assests/success.mp3';

import './Alert.scss';

export default function Alert({danger, success, message}) {
    
    const classes = ['alert']
    if (danger ) {
        classes.push('danger');
        soundError(errorSound);
    }
    if( success) { 
        classes.push('success');
        soundError(successSound);
    }


    return (
        <div className={classes.join(' ')}>
            <p className="alert__content">
                <span className="alert__content--bold">{!success ? 'Warning' : 'Success'}</span>: {message}
            </p>
        </div>
    )
};
