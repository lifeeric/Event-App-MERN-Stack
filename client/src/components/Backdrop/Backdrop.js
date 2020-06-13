import React from 'react';

import './Backdrop.scss';

export default (props) => (
    <div className="backdrop" onClick={props.onTrigger}></div>
);