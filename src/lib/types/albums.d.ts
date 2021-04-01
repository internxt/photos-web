export interface IAlbum {
  createdAt: Date,
  id: number,
  name: string,
  photos: IAlbumPhoto[],
  updatedAt: Date,
  userId: number
}

export interface IAlbumPhoto {
  bucketId: string,
  createdAt: string,
  fileId: string,
  hash: string,
  id: number,
  name: string,
  photosalbums: any,
  size: number,
  type: string,
  updatedAt: string,
  userId: number
}