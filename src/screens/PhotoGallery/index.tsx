
import { openDB } from 'idb';
import { useEffect, useState } from 'react';
import Header from '../../layout/Header';
import { getAllValues } from '../../lib/utils/indexedDB';
import styles from './PhotoGallery.module.scss'
import ActivityIndicator from '../../components/ActivityIndicator'

interface PhotoGalleryProps {
}

/* function setStatus(localPhotos: IHashedPhoto[], remotePhotos: IHashedPhoto[]) {
  const localPhotodLabel = _.map(localPhotos, o => _.extend({ isLocal: true }, o))
  const remotePhotosLabel = _.map(remotePhotos, o => _.extend({ isUploaded: true }, o))

  const union = _.unionBy([...localPhotodLabel, ...remotePhotosLabel], (o) => {
    const a = localPhotodLabel.find(id => id.hash === o.hash)
    const b = remotePhotosLabel.find(id => id.hash === o.hash)

    return _.merge(a, b)
  })

  return union;
}

async function checkExists(photos: IHashedPhoto[]) {
  return async.filter(photos, (photo, nextPhoto) => {
    RNFS.exists(photo.localUri).then((exists) => {
      nextPhoto(null, exists);
    }).catch((err) => nextPhoto(err));
  })
} */

const PhotoGallery = (props: PhotoGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [photosToRender, setPhotosToRender] = useState<any[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<[]>([]);
  const [isDownloading, setIsDownloading] = useState(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const WINDOW_WIDTH = window.innerWidth

  /*   const filteredPhotos = setStatus(localPhotos, uploadedPhotos); */

  /* const loadLocalPhotos = (after?: string) => {
    return getLocalImages(after).then(res => {
      setLocalPhotos(after ? localPhotos.concat(res.assets) : res.assets)
      setEndCursor(res.endCursor)
      return res;
    }).then(res => {
      setIsLoading(false);
      return res;
    })
  }

  const loadUploadedPhotos = async () => {
    setIsDownloading(true);
    getPreviews((newPreview) => {
      setUploadedPhotos(uploadedPhotos.concat([newPreview]))
    }).then(res => {
      checkExists(res).then(resExists => setUploadedPhotos(resExists))
    }).then(() => {
      setIsLoading(false)
    }).catch(() => {
    }).finally(() => {
      setIsDownloading(false);
    })
  }

  const loadPhotos = (after?: string) => {
    return Promise.race([
      loadLocalPhotos(after),
      loadUploadedPhotos()
    ])
  } */

  useEffect(() => {
    openDB('test2').then(db => {
      console.log('dataBase opened =>', db)

      // get all stored photos in the database on first render
      getAllValues('photos', db).then(photos => {
        console.log('photoGallery useEffect =>', photos.length)
        setPhotosToRender(photos)
      }).finally(() => setIsLoading(false))
    })
  }, [])

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.titleContainer}>
        <h1 className={styles.title}>
          All photos {isLoading ? <ActivityIndicator /> : null}
        </h1>

        <span className={styles.photosCount}>
          {photosToRender.length} Photos
          </span>
      </div>

      <div className={`${styles.photoList}`}>
        {photosToRender.map(photo => <img className={`${styles.photo}`} src={photo.src} key={photo.previewId} />)}
        {/* {
          !isLoading ?
            <PhotoList
              data={filteredPhotos}
              numColumns={3}
              onRefresh={() => {
                setIsLoading(true);
                loadPhotos().finally(() => setIsLoading(false));
              }}
              onItemPress={(event, item) => {
                if (item.isUploaded && !item.isLocal) {
                  downloadPhoto(item).then(x => {
                    loadPhotos();
                  }).catch((err) => {
                  })
                } else {
                  FileViewer.open(item.localUri || '')
                }
              }}
              keyExtractor={(item) => item.id}
              contentContainerclassName={styles.flatList}
              onEndReached={() => loadPhotos(endCursor)}
            />
            :
            <WaveIndicator color="#5291ff" size={50} />
        } */}
      </div>
    </div>
  )
}

export default PhotoGallery