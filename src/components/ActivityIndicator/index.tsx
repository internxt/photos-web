import styles from './ActivityIndicator.module.scss';

export default function LoadingFileExplorer() {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.loader06}`}></div>
    </div>
  )
}