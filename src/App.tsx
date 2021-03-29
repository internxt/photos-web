import 'bootstrap/dist/css/bootstrap.min.css'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import './App.scss'
import Home from './screens/Home'
import Login from './screens/Login'
import { useEffect, useState } from 'react'
import Settings from './lib/utils/settings'
import New from './screens/Login/New'
import PhotoGallery from './screens/PhotoGallery'
import { createObjectStore } from './lib/utils/indexedDB'
import { toast } from 'react-toastify'

interface IUser {

}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>()
  const [db, setDb] = useState<any>()

  const handleKeySaved = (user: JSON) => {
    Settings.set('xUser', JSON.stringify(user))
    setIsAuthenticated(true)
    setUser(user)
  }

  useEffect(() => {
    const runIndexDb = async () => {
      await createObjectStore(['photos', 'albums']).then(db => {
        if (db) {
          setDb(db)
        } else throw new Error
      }).catch(err => toast.warn('Could not create local database. Error: ' + err))
    }
    runIndexDb().finally(() => setIsLoading(false))
  }, [])

  return (
    <BrowserRouter>
      {!isLoading ?
        <Switch>
          <Route path='/login' render={() => <Login isAuthenticated={isAuthenticated} handleKeySaved={handleKeySaved} />} />

          <Route exact path='/new' render={(historyProps: any) => <New isNewUser={true} isAuthenticated={isAuthenticated} handleKeySaved={handleKeySaved} {...historyProps} />} />

          <Route path='/app' render={() => <Home dataBase={db} />} />

          <Route path='/gallery' render={() => <PhotoGallery dataBase={db} />} />

          <Route exact path='/'>
            <Redirect to="/login" />
          </Route>
        </Switch>
        :
        null
      }
    </BrowserRouter>
  )
}

export default App;
