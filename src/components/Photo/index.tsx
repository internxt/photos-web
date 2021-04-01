import { useEffect, useState } from 'react'
import ImageViewer from './ImageViewer'
import styles from './Photo.module.scss'
import disableScroll from 'disable-scroll'
import { IRenderablePreview } from '../../lib/types/photos'
import fileDownload from 'js-file-download'

export interface PhotoProps {
  photo: IRenderablePreview,
  isSelective: boolean,
  style?: string,
  handleSelection?: (selectedPhotoId: number) => void
}

const Photo = (props: PhotoProps) => {
  const [isHidden, setIsHidden] = useState(true)
  const [isSelected, setIsSelected] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [originalPhoto, setOriginalPhoto] = useState('')
  const [tempDownloadedPhoto, setTempDownloadedPhoto] = useState('')

  const handleClick = () => {
    setIsDownloading(true)

    if (!isHidden) setIsHidden(true)
    if (tempDownloadedPhoto && isHidden) setIsHidden(false)
    if (!isDownloading && !tempDownloadedPhoto) {
      console.log('downloading photo...')
      downloadPhoto(props.photo).then(url => {
        setTempDownloadedPhoto(url)
        setIsHidden(!isHidden)
        setIsDownloading(false)
      })
    }
  }

  const handlePhotoDownload = () => {
    if (tempDownloadedPhoto) fileDownload(tempDownloadedPhoto, props.photo.originalPhotoName)
  }

  const downloadPhoto = (photo: IRenderablePreview) => {
    const photoId = photo.originalPhotoId
    const h = {
      'content-type': 'application/json; charset=utf-8',
      'internxt-version': '1.0.0',
      'internxt-client': 'drive-mobile',
      'Authorization': `Bearer ${process.env.REACT_APP_XTOKEN}`,
      'internxt-mnemonic': process.env.REACT_APP_MNEMONIC
    }

    return fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/storage/photo/${photoId}`, { headers: h })
      .then(photo => photo.blob())
      .then(blob => {
        return URL.createObjectURL(blob)
      })
  }

  useEffect(() => {
    if (!isHidden) disableScroll.on()
    else disableScroll.off()
  }, [isHidden])

  if (!props.isSelective) {
    return (
      <div>
        <ImageViewer isHidden={isHidden} handleClick={handleClick} src={tempDownloadedPhoto} />

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