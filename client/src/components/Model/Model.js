import React  from 'react';
import Button from '../Button/Button';

import './Model.scss';

export default function Model({title, children, btnTitle, onCancle, onConfirm}) {
    return (
        <div className="model">
            <div className="model__header">
                <h1 className="model__header--title">{title}</h1>
            </div>
            <div className="model__body">
                {children}
            </div>
            <div className="model__actions">
                <Button onTrigger={onCancle} title="Cancel" secondary />
                <Button onTrigger={onConfirm} title={btnTitle} />
            </div>
        </div>
    )
}
