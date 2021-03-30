import { useEffect, useState } from 'react'
import { IRenderablePreview } from '../AllPhotos'
import ImageViewer from './ImageViewer'
import styles from './Photo.module.scss'
import disableScroll from 'disable-scroll'

export interface PhotoProps {
  photo: IRenderablePreview,
  isSelective: boolean,
  style?: string,
  handleSelection?: (selectedPhotoId: number) => void
}

const Photo = (props: PhotoProps) => {
  const [isHidden, setIsHidden] = useState(true)
  const [isSelected, setIsSelected] = useState(false)

  const handleClick = () => {
    console.log('photo onClick =>', props.photo)
    setIsHidden(!isHidden)
  }

  useEffect(() => {
    if (!isHidden) disableScroll.on()
    else disableScroll.off()
  }, [isHidden])

  if (!props.isSelective) {
    return (
      <div>
        <ImageViewer isHidden={isHidden} handleClick={handleClick} photo={props.photo} />
        <img className={props.style ? props.style : `${styles.photo}`} src={props.photo.src} key={props.photo.previewId} onClick={handleClick} />
      </div>
    )

  } else {
    return (
      <div
        onClick={() => {
          setIsSelected(!isSelected)
          //props.handleSelection(props.photo.previewId)
        }}
      >
        <div className={isSelected ? `${styles.filled} ${styles.iconBackground}` : styles.iconBackground}>
          <span className={isSelected ? `${styles.icon}` : styles.hidden}>x</span>
        </div>

        <img className={props.style ? props.style : `${styles.photo}`} src={props.photo.src} />
      </div>)
  }
}

export default Photo