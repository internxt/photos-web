import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import './App.scss'
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' render={() => <Login />} />

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
