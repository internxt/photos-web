import styles from './albumCard.module.scss'
import bigImg from '../../assets/images/2.jpg'
import Image from 'react-bootstrap/Image';

export interface IAlbum {
  title: string,
  createdAt?: string,
  updatedAt?: string,
  id?: number,
  name?: string,
  photos: IAlbumPhoto[],
  userId?: string
}

interface IAlbumPhoto {
  bucketId: string,
  fileId: string,
  id: number,
  userId: number,
  createdAt: string,
  updatedAt: string,
  name: string,
  hash: string,
  size: number,
  type: string,
  photosalbums: any,
  localUri?: string
}

interface AlbumCardProps {
  album: IAlbum
}

const AlbumCard = (props: AlbumCardProps) => {
  return (
    <div className={`${styles.card} ${styles.boxShadow}`}>
      <div className={`${styles.albumCover}`}>
        <div className={`${styles.bigImageContainer}`}>

        </div>

        <div className={`${styles.smallImageContainer}`}>
          <div className={`${styles.image}`}>

          </div>

          <div className={`${styles.image}`}>

          </div>
        </div>
      </div>

      <div>

      </div>
    </div>
  )
}

export default AlbumCard;