import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import './App.scss'
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'
import New from './screens/Login/New'
import { useState } from 'react';
import Settings from './lib/utils/settings';

interface IUser {

}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>()

  const handleKeySaved = (user: JSON) => {
    Settings.set('xUser', JSON.stringify(user))
    setIsAuthenticated(true)
    setUser(user)
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' render={(props) => <Login isAuthenticated={isAuthenticated} handleKeySaved={handleKeySaved} />} />

        <Route exact path='/new' render={(props: any) => <New isNewUser={true} isAuthenticated={isAuthenticated} handleKeySaved={handleKeySaved} {...props} />} />

        <Route path='/register' render={() => <Register />} />

        <Route path='/photos' render={() => <Home />} />

        <Route exact path='/'>
          <Redirect to="/login" />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App;
