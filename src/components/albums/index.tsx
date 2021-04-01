import { IDBPDatabase } from "idb";
import { useEffect, useState } from "react";
import { IAlbum } from "../../lib/types/albums";
import { IRenderablePreview } from "../../lib/types/photos";
import { getAlbums } from "../../screens/Home/init";
import AlbumCard from "./AlbumCard";
import CreateAlbumCard from "./CreateAlbumCard";

interface AlbumProps {
  database: IDBPDatabase<unknown>,
  photosToRender: IRenderablePreview[]
}

const Albums = (props: AlbumProps) => {
  const [albums, setAlbums] = useState<IAlbum[]>([])

  useEffect(() => {
    getAlbums().then(albums => {
      //console.log('albums =>', res)
      setAlbums(albums)
    })
  }, [])

  return (
    <div className={`home-container`}>
      <div className={`home-titleContainer`}>
        <h1 className={`home-title`}>Albums</h1>

        <span className={`home-filter`}>Filter</span>
      </div>

      {
        albums.length > 0 ?
          <div className={`list-group list-group-horizontal overflow-auto pl-3 pr-3`}>
            {albums.map(album => (<AlbumCard album={album} key={album.id} database={props.database} photosToRender={props.photosToRender} />))}
          </div>
          :
          <CreateAlbumCard />
      }
    </div>
  )
}

export default Albums;