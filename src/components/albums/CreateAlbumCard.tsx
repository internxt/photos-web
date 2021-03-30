import styles from './CreateAlbumCard.module.scss'
import create from '../../assets/icons/icon-create.png'

// TODO: Add album param
const CreateAlbumCard = () => {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.card}`}>
        <img src={create} className={`${styles.icon}`} />

        <span className={`${styles.title}`}>
          Create New Album
        </span>
      </div>
    </div>
  )
}

export default CreateAlbumCard