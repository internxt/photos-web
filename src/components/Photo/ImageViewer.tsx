import fileDownload from 'js-file-download';
import { IRenderablePreview } from '../../lib/types/photos';
import styles from './ImageViewer.module.scss'

export interface ImageViewerProps {
  isHidden: boolean,
  handleClick: () => void,
  src: string
}
 
const ImageViewer = (props: ImageViewerProps) => {

  return (
    <div className={props.isHidden ? `${styles.hidden}` : `${styles.container}`} onClick={props.handleClick}>
      <img src={props.src} className={`${styles.photo}`} />
      <span className={`${styles.download}`}>Download</span>
    </div>
  )
}
 
export default ImageViewer;