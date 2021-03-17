import styles from './albumCard.module.scss'
import { useState } from 'react';

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
  const [photos, setPhotos] = useState(props.album.photos)

  return (
    <div className={`${styles.card}`}>
      <div className={`${styles.albumCover}`}>
        <div className={`${styles.primaryCoverPhoto}`}>
          big chungus
        </div>

        <div className={`${styles.secondaryCoverPhotos}`}>
          <div className={`${styles.smallPhoto} ${styles.roundedBottomLeft} mr-1`}>
            small chungus
          </div>

          <div className={`${styles.smallPhoto}`}>
            small chungus
          </div>
        </div>
      </div>

      <div className={`${styles.photosList}`}>
        {
          photos.map(photo => (
            <img className={`${styles.photo}`} src={photo.localUri} />
          ))
        }
      </div>
    </div>
  )
}

export default AlbumCard;