import styles from './CreateAlbumCard.module.scss'
import create from '../../assets/icons/icon-create.png'
import { useHistory } from 'react-router'

// TODO: Add album param
const CreateAlbumCard = () => {
  const history = useHistory()

  return (
    <div className={`${styles.container}`} onClick={() => history.push('/create-album')} >
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