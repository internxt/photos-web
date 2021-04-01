import { useEffect, useState } from 'react'
import ImageViewer from './ImageViewer'
import styles from './Photo.module.scss'
import disableScroll from 'disable-scroll'
import { IRenderablePreview } from '../../lib/types/photos'

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
          console.log('photo on click =>', props.photo)
          setIsSelected(!isSelected)
          props.handleSelection ? props.handleSelection(props.photo.originalPhotoId) : null
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