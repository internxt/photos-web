import { useEffect, useState } from 'react'
import { IRenderablePreview } from '../AllPhotos'
import ImageViewer from './ImageViewer'
import styles from './Photo.module.scss'
import disableScroll from 'disable-scroll'

export interface PhotoProps {
  photo: IRenderablePreview,
  style?: string
}

const Photo = (props: PhotoProps) => {
  const [isHidden, setIsHidden] = useState(true)

  const handleClick = () => {
    console.log('photo onClick =>', props.photo)
    setIsHidden(!isHidden)
  }

  useEffect(() => {
    if (!isHidden) disableScroll.on()
    else disableScroll.off()  
  }, [isHidden])

  return (
    <div>
      <ImageViewer isHidden={isHidden} handleClick={handleClick} photo={props.photo} />
      <img className={props.style ? props.style : `${styles.photo}`} src={props.photo.src} key={props.photo.previewId} onClick={handleClick} />
    </div>

  )
}

export default Photo