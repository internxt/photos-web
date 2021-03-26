import styles from './home.module.scss'
import Header from '../../layout/Header';
import AllPhotos from '../../components/AllPhotos';
import Albums from '../../components/Albums';

const Home = () => {

  return (
    <div className={`${styles.mainContainer}`}>
      <Header
        showFileButtons={true}
        showSettingsButton={true}
      />

      {/* <Albums /> */}

      <AllPhotos />

      <div className={`${styles.container} ${styles.deleted}`}>deleted photos</div>
    </div>
  )
}

export default Home;