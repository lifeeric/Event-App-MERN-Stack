import React from 'react';
import Model  from '../../Model/Model';
import Backdrop from '../../Backdrop/Backdrop';
import Form     from '../../Form/Form';
import Spinner  from '../../Spinner/Spinner';
import Alert    from '../../Alert/Alert';
import Sender   from '../../../helper/sender-hel';
import AuthContext from '../../../context/global-context';



function CreateEvent({creating, onHidder, allEvents, setEvents }) {

    // Context
    const { token } = React.useContext(AuthContext);

    // State Error Handling
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError]       = React.useState(false);
    const [statusMessage, setMess]= React.useState('');

    // Form Data using Ref
    const eventTitle = React.useRef();
    const eventDate  = React.useRef();
    const eventDesc  = React.useRef();
    const eventPrice = React.useRef();

    if(!creating)
        return null;


    const fieldsForCreatingEvent = [
        {
            title: 'Title',
            type: 'text',
            value: eventTitle,
            placeholder: 'Going to NY...',
            validation: {
                isRequired: true
            }
        },
        {
            title: 'Price',
            value: eventPrice,
            type: 'number',
            placeholder: '99.99',
            validation: {
                isRequired: true
            }
        },
        {
            title: 'Date',
            value: eventDate,
            type: 'date',
            validation: {
                isRequired: true
            }
        },
        {
            title: 'Description',
            value: eventDesc,
            type: 'textarea',
            placeholder: 'John is gonna oversea...',
            validation: {
                isRequired: true
            }
        }
    ]

    // Data Submitting 
    const onDataDatingHandler = () => {

        const title = eventTitle.current.value;
        const price = +eventPrice.current.value;
        const description = eventDesc.current.value;
        const date  = eventDate.current.value;

        // Validation
        if( title.trim().length === '' ||
            price <= 0 ||
            description.trim().length === '' ||
            isNaN(new Date(date).getTime())
        ){
            setError(true);
            setMess('All Fields are required!');
            return;
        }


        // Start Loading
        setLoading(true);
        

        // GraphQL Query
        const query = `
            mutation createEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
                createEvent(event: { title: $title, price: $price, description: $description, date: $date}) {
                    _id
                    title
                    description
                    date
                    price
                    creator {
                        email
                    }
                }
            }
        `;


        Sender({
            query: query,
            variables: {
                title,
                price,
                description,
                date
            }
        }, token)
        .then(res => {
            setEvents([...allEvents, res.data.data.createEvent])
            setLoading(false);
            setError(true);
            setMess('Event Successfully Created!')
            setTimeout(() => {
                setError(false)
                 onHidder()
            }, 1500);
        })
        .catch(err => {
            setLoading(false);
            setError(true);
            setMess('Internal Errror!');
            throw err;
        });

    }

    return (
        <>
            <Backdrop onTrigger={onHidder} />
            <Model title="Creating New Event"
                onCancle={onHidder}
                onConfirm={onDataDatingHandler}
                btnTitle="Create"
                >
                { isLoading ? <Spinner /> :
                    <> 
                        <Form formFields={fieldsForCreatingEvent}/>
                    </>
                }
                {  error && !isLoading ? 
                    <Alert 
                        danger={statusMessage === 'Internal Errror!' || statusMessage === 'All Fields are required!'} 
                        success={statusMessage === 'Event Successfully Created!'}
                        message={statusMessage} 
                        /> : null
                }

            </Model>
        </>
    )
};

export default CreateEvent;