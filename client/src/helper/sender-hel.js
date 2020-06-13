import axios from 'axios';

export default (data, token) => (

    axios({
        url: 'http://localhost:8000/graphql',
        method: "POST",
        data: data,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })

);