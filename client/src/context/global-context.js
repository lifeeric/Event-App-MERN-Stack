import React from 'react';

const ReactContext = React.createContext({
    token: '',
    userId: '',
    email: '',
    login: (userId, toke) => {},
    logout:() => {}
});

export default ReactContext;