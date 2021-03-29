import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import './App.scss'
import Home from './screens/Home'
import Login from './screens/Login'
import { useEffect, useState } from 'react';
import Settings from './lib/utils/settings';
import New from './screens/Login/New';
import Photos from './screens/PhotoGallery';

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

  useEffect(() => {
    /* const runIndexDb = async () => {
      await createObjectStore(['photos', 'albums'])
      await putBulkValue('albums', [
        {
          title: 'Random shit', photos: [
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: 'o8i8lkh87ihikhj' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'a', size: 200, type: 'jpg', photosalbums: {}, localUri: 'o8i8lkh87ihikhj' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'b', size: 200, type: 'jpg', photosalbums: {}, localUri: 'o8i8lkh87ihikhj' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'c', size: 200, type: 'jpg', photosalbums: {}, localUri: 'o8i8lkh87ihikhj' },
          ]
        },
        {
          title: 'More random shit', photos: [
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'err', size: 200, type: 'jpg', photosalbums: {}, localUri: 'fdszw' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'f', size: 200, type: 'jpg', photosalbums: {}, localUri: 'feteszreszfdz' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'g', size: 200, type: 'jpg', photosalbums: {}, localUri: 'feteszreszfdz' },
          ]
        },
        {
          title: 'Even more random shit lol', photos: [
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'h', size: 200, type: 'jpg', photosalbums: {}, localUri: '53li,jvx' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'i', size: 200, type: 'jpg', photosalbums: {}, localUri: '53li,jvx' },
          ]
        },
        {
          title: 'This normal', photos: [
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'j', size: 200, type: 'jpg', photosalbums: {}, localUri: 'ewfes' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'drr', size: 200, type: 'jpg', photosalbums: {}, localUri: 'ewf' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dn', size: 200, type: 'jpg', photosalbums: {}, localUri: 'o876tycs' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dm', size: 200, type: 'jpg', photosalbums: {}, localUri: 'o876tycs' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'de', size: 200, type: 'jpg', photosalbums: {}, localUri: 'o876tycs' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'df', size: 200, type: 'jpg', photosalbums: {}, localUri: 'o876tycs' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'l', size: 200, type: 'jpg', photosalbums: {}, localUri: 'fes' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dg', size: 200, type: 'jpg', photosalbums: {}, localUri: 'fes' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'l', size: 200, type: 'jpg', photosalbums: {}, localUri: 'fes' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'do', size: 200, type: 'jpg', photosalbums: {}, localUri: 'fes' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dp', size: 200, type: 'jpg', photosalbums: {}, localUri: 'fes' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'k', size: 200, type: 'jpg', photosalbums: {}, localUri: 'sefsef' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'k', size: 200, type: 'jpg', photosalbums: {}, localUri: 'sefsef' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'k', size: 200, type: 'jpg', photosalbums: {}, localUri: 'sefsef' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dq', size: 200, type: 'jpg', photosalbums: {}, localUri: 'esrser' },
          ]
        },
        { title: 'This not normal', photos: [{ bucketId: '1', fileId: '1', id: 1, userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '../../assets/images/5.jpg' }] },
        {
          title: 'More random shit', photos: [
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'dr', size: 200, type: 'jpg', photosalbums: {}, localUri: '566er' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: 'adsrec34' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: 'adsrec34' },
          ]
        },
        {
          title: 'Even more random shit lol', photos: [
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '634tr' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '634tr' },
          ]
        },
        {
          title: 'This normal', photos: [
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '124ewsafd' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '124ewsafd' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '124ewsafd' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '124ewsafd' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '124ewsafd' },
            { bucketId: '1', fileId: '1', id: Math.floor(Math.random() * 100000000), userId: 1, createdAt: '123', updatedAt: '123', name: 'image', hash: 'd', size: 200, type: 'jpg', photosalbums: {}, localUri: '32rqewfds' },
          ]
        }
      ])
      await putBulkValue('photos', [
        { id: 1, localUri: '../../assets/images/1.jpg' },
        { id: 2, localUri: '../../assets/images/2.jpg' },
        { id: 3, localUri: '../../assets/images/3.jpg' },
        { id: 4, localUri: '../../assets/images/4.jpg' },
        { id: 5, localUri: '../../assets/images/5.jpg' },
        { id: 6, localUri: '../../assets/images/6.jpg' },
        { id: 7, localUri: '../../assets/images/7.jpg' },
        { id: 8, localUri: '../../assets/images/8.jpg' },
        { id: 9, localUri: '../../assets/images/9.jpg' },
        { id: 10, localUri: '../../assets/images/10.jpg' },
        { id: 11, localUri: '../../assets/images/11.jpg' },
        { id: 12, localUri: '../../assets/images/12.jpg' },
        { id: 13, localUri: '../../assets/images/13.jpg' },
        { id: 14, localUri: '../../assets/images/14.jpg' },
        { id: 15, localUri: '../../assets/images/15.jpg' }
      ])
    }
    runIndexDb().then(() => setDBOpen(true)) */
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' render={(props) => <Login isAuthenticated={isAuthenticated} handleKeySaved={handleKeySaved} />} />

        <Route exact path='/new' render={(props: any) => <New isNewUser={true} isAuthenticated={isAuthenticated} handleKeySaved={handleKeySaved} {...props} />} />

        <Route path='/app' render={() => <Home />} />

        <Route path='/photos' render={() => <Photos />} />

        <Route exact path='/'>
          <Redirect to="/login" />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App;
