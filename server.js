const express        = require('express');
const mongoose       = require('mongoose');
const expressGraphql = require('express-graphql');
const graphqlSchema  = require('./graphql/schema/schema');
const graphqlResolver= require('./graphql/resolvers/index');
const Auth           = require('./Auth/Auth.user');
const cors           = require('cors');
const path           = require('path');
const fallback       = require('express-history-api-fallback');
require('dotenv').config();
// App
const app = express();

// MiddleWare Auth
app.use(cors());
app.use(Auth);



// GraphQL API Setup
app.use('/graphql', expressGraphql({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}));


// Route

if( process.env.NODE_ENV === 'production' )
{
    app.use('/', express.static(path.join(__dirname, 'client/build')));
    
    // Direct URL ACCESSING /abc, by default doesn't allow us
    app.use('*', (req, res) => {
        console.log(req.url);
        res.sendFile(path.join(__dirname, 'client/build/index.html'))
    });
    // app.use(fallback(__dirname + '/client/build/index.html'));
}

// DB connection
const uri = "mongodb://localhost:27017/max2"

mongoose.connect(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB is connected'))
    .catch(err => console.error(err, 'Falied to connected'));


// Port
const Port = process.env.PORT || 8000;

// Server
app.listen(Port, console.log(`Server is running on ${Port}`));