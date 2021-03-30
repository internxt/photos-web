import { openDB } from "idb"
import { ChangeEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { IRenderablePreview } from "../../components/AllPhotos"
import Photo from "../../components/Photo"
import { IApiPreview } from "../../lib/types/photos"
import { getAllValues } from "../../lib/utils/indexedDB"
import styles from './CreateAlbum.module.scss'

const CreateAlbum = () => {
  const [photos, setPhotos] = useState<IRenderablePreview[]>([])
  const [albumTitle, setAlbumTitle] = useState('')
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<any[]>([])

  useEffect(() => {
    //getPreviews().then(res => setPhotos(res)).finally(() => setIsLoading(false))
    openDB('test2').then(db => {
      getAllValues('photos', db).then(photos => {
        return photos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
      }).then(previews => setPhotos(previews))
        .finally(() => setIsLoading(false))
    })
  }, [])

  const uploadAlbum = async (): Promise<void> => {
    /* const xToken = props.authenticationState.token
    const mnemonic = props.authenticationState.user.mnemonic
    const headers = await getHeaders(xToken, mnemonic)*/
    const body = { name: albumTitle, photos: selectedPhotos }
    const h = {
      'content-type': 'application/json; charset=utf-8',
      'internxt-version': '1.0.0',
      'internxt-client': 'drive-mobile',
      'Authorization': `Bearer ${process.env.REACT_APP_XTOKEN}`,
      'internxt-mnemonic': process.env.REACT_APP_MNEMONIC
    }

    return fetch(`${process.env.REACT_NATIVE_API_URL}/api/photos/album`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify(body)
    }).then(res => {
      return res.json()
    })
  }

  const handleSelection = (selectedPhotoId: number) => {
    const currentSelectedPhotos = selectedPhotos
    const isAlreadySelected = currentSelectedPhotos.find(photoId => photoId === selectedPhotoId)

    if (isAlreadySelected) {
      const newSelectedPhotos = currentSelectedPhotos.filter(photoId => photoId === selectedPhotoId ? null : photoId)

      setSelectedPhotos(newSelectedPhotos)

    } else {
      currentSelectedPhotos.push(selectedPhotoId)
      setSelectedPhotos(currentSelectedPhotos)
    }
  }

  const handlePress = () => {
    // reset all selected photos
  }

  //const renderItem = (item: IApiPreview, index: number) => (<SelectivePhoto photo={item} handleSelection={handleSelection} handleLongPress={handleLongPress} key={index} />)

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.inputContainer}`}>
        <input className={`${styles.input}`}
          placeholder='Name your memories'
          value={albumTitle}
          autoCapitalize='none'
          onChange={e => setAlbumTitle(e.target.value)}
        />

        <button className={!isCreatingAlbum ? `${styles.button}` : `${styles.button} ${styles.disabled}`}
          disabled={isCreatingAlbum}
          onSubmit={() => {
            if (albumTitle) {
              if (albumTitle.length > 30) {
                toast.warn('Maximum album length name is 30 characters')
              } else {
                if (selectedPhotos.length > 0) {
                  setIsCreatingAlbum(true)
                  uploadAlbum().finally(() => setIsCreatingAlbum(false))
                  handlePress()
                } else {
                  toast.warn('You need to select at least one photo')
                }
              }
            } else {
              toast.warn('Album name is required')
            }
          }}
        >
          <span className={`${styles.buttonText}`}>Done</span>
        </button>
      </div>

      <span className={`${styles.title}`}>
        Select photos to create album
      </span>

      <div className={`grid grid-cols-4 gap-4 my-4 mx-auto 1080:grid-cols-5 1280:grid-cols-6 1440:grid-cols-7 1920:grid-cols-8 overflow-auto`}>
        {
          !isLoading ?
            !isCreatingAlbum ?
              photos.map(photo => <Photo style={`w-44 h-44 object-cover rounded-lg hover:opacity-70 cursor-pointer 1920:w-48 1920:h-48`} photo={photo} isSelective={true} />)
              :
              <span>creating album</span>
            :
            <span>loading photos</span>
        }
      </div>
    </div>
  )
}

export default CreateAlbum