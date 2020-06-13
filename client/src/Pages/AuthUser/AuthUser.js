import React, { useState, useRef, useContext } from 'react';
import Button from '../../components/Button/Button';
import Sender from '../../helper/sender-hel';
import Sound  from '../../helper/sound.hel';
import AuthContext from '../../context/global-context';

import './AuthUser.scss';

// Sound 
import errorSound from '../../assests/error.mp3';
import successSound from '../../assests/success.mp3';

export default ({history, location}) => {

    let uriForSigning = "Log In";
    // State 
    if( location.pathname === "/newauth" )
        uriForSigning = "Sign Up";
        
    const [name, setName] = useState(uriForSigning);
    const [statusMessage, setStatus ] = useState({error: '', message: ''});
    const [eErr, setE]   = useState(false);
    const [pErr, setP]   = useState(false);
    const emailEl        = useRef();
    const passwordEl     = useRef();
    
    // Accessing to Context to save Login Data
    const { login }  = useContext(AuthContext);

    // Form Switching
    const switchingFormHandler = () => {
        
        if(name === 'Log In')
        {
            history.push('/newauth');
        }
        else 
        {
            history.push('/auth');
        }

        return;
    }

    // Error Handling
    const errorHandling = () => {
        
        setStatus({error: '', message: ''});

        if( emailEl.current.value !== '' )
            setE(false);
        if( passwordEl.current.value !== '' )
            setP(false);
    }

    // Form Submitting
    const submitDataHandler = async () => {
        const email = emailEl.current.value;
        const pass  = passwordEl.current.value;

        // Validation
        if( email.trim().length === 0 || pass.trim().length === 0 )
        {
            Sound(errorSound);
            setStatus({message:'All Fields are required!', error:'error'});
            
            if(!email)
                setE(true)
            if(!pass)
                setP(true)

            return;
        }

        /** GraphQL Query For Creating User */

        let graphqlQuery = `
                mutation createUser($email: String!, $pass: String!) {
                    createUser(user: {email: $email, password: $pass})
                    {
                        email
                        _id
                        error {
                            error
                            message
                        }
                    }
                }
            `;

        
        // Login Query
        if(name === "Log In")
        {
            graphqlQuery = `
                query login($email: String!, $pass: String! ) {
                    login(email: $email, password: $pass) {
                        token
                        _id
                        error {
                            error
                            message
                        }
                    }
                }
            `
        }


        // Send to Back End
        Sender({
            query: graphqlQuery,
            variables: {
                email: email,
                pass: pass
            }
        }, '')
        .then(res => {
            // Copy the response
            const data = {...res.data.data };

            let error

            // For creating user
            if( name === "Log In" )
                error = data.login.error;
            else
                error = data.createUser.error;
            

            // Check the Errors
            if( error.error === "true" )
            {
                Sound(errorSound);

                // Passwrod checking
                if( error.message !== "Password doen't match!" )
                    setE(true)
                else 
                    setP(true)
                    
                setStatus({...error, error: 'error'});
                return;
            }

            // Return the Success Message
            setStatus({...error, error: 'success'});
            Sound(successSound);

            // Save Token            
            if( name === "Log In")
            {
                login(data.login._id, data.login.token, email);
                history.push('/events');
            }
            return;
        })
        .catch(err => {
            throw err;
        });

        

    }


    return (
        <div className="container">
            <h1>{name}</h1>
            <div className="container__form">
                <form>
                    <div className="form-control">
                        <label htmlFor="email">E-mail</label>
                        <input placeholder="john@email.com" onKeyUp={errorHandling} className={eErr ? 'error' : ''} ref={emailEl} type="text" id="email" />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input placeholder="******" onKeyUp={errorHandling} className={pErr ? ' error' : ''} type="password" ref={passwordEl} id="password" />
                    </div>
                    <Button title={name} onTrigger={submitDataHandler} />
                    <Button 
                        title={name === "Log In" ? "Create New Account" : 'Log In'}
                        secondary 
                        small 
                        onTrigger={switchingFormHandler}
                    />
                </form>

                <div className={`container__form--${statusMessage.error}`}>
                    <p>{statusMessage.message}</p>
                </div>
            </div>
        </div>
    );
}