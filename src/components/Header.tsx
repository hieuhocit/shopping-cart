import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import Search from './Search';
import styles from '../styles/Header.module.scss';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default function Header({ onClickCart, notices }: { onClickCart: () => void; notices: number }) {
  return (
    <header className={styles.header}>
      <NavLink
        to='/'
        className={styles.logoContainer}
      >
        <div>
          <img
            src={logo}
            alt='logo'
          />
        </div>
        <span>Dragon Ball</span>
      </NavLink>

      <Search />

      <div
        className={styles.cart}
        onClick={onClickCart}
      >
        <FontAwesomeIcon
          icon={faCartShopping}
          className={styles.icon}
        />
        {notices > 0 && <p className={styles.notices}>{notices}</p>}
      </div>
    </header>
  );
}
