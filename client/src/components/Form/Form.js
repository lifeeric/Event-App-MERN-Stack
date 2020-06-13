import React from 'react'

import './Form.scss';

export default function Form({formFields}) {

    // Injecting HTML input field to DOM As per request required
    const fieldsRendering = formFields.map((field, index) => {

        let htmlField;

        // Only for the TextArea
        if(field.type === 'textarea')
        {
            htmlField = (
                <div key={index} className="form__control">
                    <label htmlFor={field.title}>{field.title}</label>
                    <textarea ref={field.value} placeholder={field.placeholder} />
                </div>
            );
        }
        else {

            htmlField = (
                    <div key={index} className="form__control">
                        <label htmlFor={field.title}>{field.title}</label>
                        <input 
                            type={field.type}
                            id={field.title}
                            ref={field.value}
                            placeholder={field.placeholder && field.placeholder} 
                        />
                    </div>  
            );
        }

        return htmlField;
    });

    return (
        <form className="form">
            {fieldsRendering}
        </form>
    )
};
