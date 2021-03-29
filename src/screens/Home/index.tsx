import Albums from '../../components/Albums';
import AllPhotos from '../../components/AllPhotos';
import Header from '../../layout/Header';
import styles from './home.module.scss'
const Home = () => {

  return (
    <div className={`${styles.mainContainer}`}>
      <Header
        showFileButtons={true}
        showSettingsButton={true}
      />

      <Albums />

      <AllPhotos />

      <div className={`${styles.container} ${styles.deleted}`}>deleted photos</div>
    </div>
  )
}

export default Home;