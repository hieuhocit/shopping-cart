import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Message.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Message({
  message,
  type,
  id,
  index,
  onRemoveMessage,
}: {
  message: string;
  type: string;
  index: number;
  id: string;
  onRemoveMessage: (id: string) => void;
}) {
  return (
    <div
      className={styles.msgContainer}
      style={{ '--translate-Y': index * 60 + 60 + 'px' } as React.CSSProperties}
      onAnimationEnd={() => onRemoveMessage(id)}
    >
      <div className={styles.msg}>
        <span>{message}</span>
        {type === 'success' && (
          <FontAwesomeIcon
            icon={faCheck}
            className={styles.icon}
          />
        )}
        {type === 'sold out' && (
          <FontAwesomeIcon
            icon={faX}
            className={styles.icon}
            style={{ color: 'red' }}
          />
        )}
      </div>
    </div>
  );
}
