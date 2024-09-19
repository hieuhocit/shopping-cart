import { ErrorResponse, useRouteError, Link } from 'react-router-dom';
import styles from '../styles/ErrorElement.module.scss';

export default function ErrorElement() {
  const error: ErrorResponse = useRouteError() as ErrorResponse;
  console.log(error);
  return (
    <div className={styles.errorContainer}>
      <div className={styles.error}>
        <h1>{error.statusText}</h1>
        <h2>Status: {error.status}</h2>
        <h3>{error.data}</h3>
      </div>
      <button>
        <Link to='/'>Back to home page</Link>
      </button>
    </div>
  );
}
