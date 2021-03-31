import styles from './home.module.scss'
import Header from '../../layout/Header';
import AllPhotos from '../../components/AllPhotos';
import { useState } from 'react';
import { IDBPDatabase } from 'idb';
import Albums from '../../components/Albums';

interface HomeProps {
  database: IDBPDatabase<unknown>
}

const Home = (props: HomeProps) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`${styles.mainContainer}`}>
      <Header
        showFileButtons={true}
        showSettingsButton={true}
      />

      <Albums database={props.database} />

      <AllPhotos database={props.database} />

      <div className={`${styles.container} ${styles.deleted}`}>deleted photos</div>
    </div>
  )
}

export default Home;