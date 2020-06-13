import React      from 'react';
import Navigation from './components/Navigation/Navigation';
import AuthUser   from './Pages/AuthUser/AuthUser';
import Events     from './Pages/Events/Events';
import Booking    from './Pages/Booking/Booking';
import AuthContext from './context/global-context';
import NotFound    from './components/NotFound/NotFound';
import Profile     from './Pages/Profile/Profile';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

function App() {

  // Data Local Data
  let localData =  localStorage.eventJWT;
  const [token, setToken ]  = React.useState('');
  const [email, setEmail]   = React.useState('');
  
  // Token getting, if exists
  if( localData && !token)
  {
    setToken(JSON.parse(localData).token);
    setEmail(JSON.parse(localData).email);
  }

  const [userId, setUserId] = React.useState('');
  

  // Login
  const login = (userId, token, email) => {
    setUserId(userId);
    setToken(token);
    setEmail(email);
    localStorage.setItem('eventJWT', JSON.stringify({token, email}));
  }

  // Logout
  const logout = () => {
    setUserId('');
    setToken('');
    setEmail('');
    localStorage.setItem('eventJWT', '');
  }

  return (
    <BrowserRouter>

      <AuthContext.Provider
        value={{
          userId,
          token,
          email,
          login,
          logout
      }}>

        <Navigation />
          
          <main>
              <Switch>
                <Redirect to="/events" exact from="/" /> 
                { !token && ["/auth", "/newauth"].map((path,index) =>
                  <Route  path={path} key={index} component={AuthUser} />
                  )}
                { !token && <Redirect to="/events" exact from="/myevents" /> }
                <Route path={["/events", "/myevents"]} exact component={Events} />
                <Route path="/bookings" component={Booking} />
                <Route path="/profile" component={Profile} />
                <Route exact={true} component={NotFound} />
              </Switch>
          </main>

      </AuthContext.Provider>
      

    </BrowserRouter>
  );
}

export default App;
