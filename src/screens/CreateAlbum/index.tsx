import { openDB } from "idb"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"
import Photo from "../../components/Photo"
import { getAllValues } from "../../lib/utils/indexedDB"
import styles from './CreateAlbum.module.scss'
import { IRenderablePreview, IStoredPreview } from '../../lib/types/photos'

const CreateAlbum = () => {
  const [photos, setPhotos] = useState<IRenderablePreview[]>([])
  const [albumTitle, setAlbumTitle] = useState('')
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<any[]>([])

  useEffect(() => {
    openDB('test2').then(db => {
      getAllValues('photos', db).then((photos: IStoredPreview[]) => {
        return photos.map(photo => ({ ...photo, src: URL.createObjectURL(photo.blob) }))
      }).then((previews: IRenderablePreview[]) => setPhotos(previews))
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

    return fetch(`${process.env.REACT_APP_PRODUCTION_API_URL}/api/photos/album`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify(body)
    }).then(res => {
      return res.json()
    }).then(res => console.log('POST album =>', res))
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('album title:', albumTitle, 'selected photos:', selectedPhotos)
    if (albumTitle) {
      if (albumTitle.length > 30) {
        toast.warn('Maximum album length name is 30 characters')
      } else {
        if (selectedPhotos.length > 0) {
          setIsCreatingAlbum(true)
          uploadAlbum().then(() => setSelectedPhotos([])).finally(() => setIsCreatingAlbum(false))
        } else {
          toast.warn('You need to select at least one photo')
        }
      }
    } else {
      toast.warn('Album name is required')
    }
  }

  return (
    <div className={`${styles.container}`}>
      <form className={`${styles.inputContainer}`}
        onSubmit={handleSubmit}
      >
        <input className={`${styles.input}`}
          placeholder='Name your memories'
          value={albumTitle}
          autoCapitalize='none'
          onChange={e => setAlbumTitle(e.target.value)}
        />

        <button className={!isCreatingAlbum ? `${styles.button}` : `${styles.button} ${styles.disabled}`} disabled={isCreatingAlbum} type='submit' >
          <span className={`${styles.buttonText}`}>Done</span>
        </button>
      </form>

      <span className={`${styles.title}`}>
        Select photos to create album
      </span>

      <div className={`grid grid-cols-4 gap-4 my-4 mx-auto 1080:grid-cols-5 1280:grid-cols-6 1440:grid-cols-7 1920:grid-cols-8 overflow-auto`}>
        {
          !isLoading ?
            !isCreatingAlbum ?
              photos.map(photo => <Photo style={`w-44 h-44 object-cover rounded-lg hover:opacity-70 cursor-pointer 1920:w-48 1920:h-48`} photo={photo} isSelective={true} handleSelection={handleSelection} />)
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