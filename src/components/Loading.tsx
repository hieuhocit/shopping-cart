import loading from '../assets/images/loading.svg';
import styles from '../styles/Loading.module.scss';

export default function Loading() {
  return(
    <div className={styles.loading}>
      <img src={loading} alt="loading gif" />
    </div>
  )
}