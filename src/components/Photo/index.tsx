import { IRenderablePreview } from '../AllPhotos'
import styles from './Photo.module.scss'

export interface PhotoProps {
  photo: IRenderablePreview
}
 
const Photo = (props: PhotoProps) => {
  return (
    <img className={`${styles.photo}`} src={props.photo.src} key={props.photo.previewId} onClick={() => console.log('Photo =>', props.photo)} />
  )
}
 
export default Photo