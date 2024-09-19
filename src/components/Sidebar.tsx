import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Sidebar.module.scss';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {open ? (
        <FontAwesomeIcon
          icon={faX}
          className={styles.icon}
          onClick={() => setOpen(false)}
        />
      ) : (
        <FontAwesomeIcon
          icon={faBars}
          className={styles.icon}
          onClick={() => setOpen(true)}
        />
      )}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <nav className={`${styles.navigation}`}>
          <ul>
            <li>
              <NavLink
                to='/'
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='shop/characters/all'
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Characters
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <div className={`${styles.bgc} ${open ? styles.open : ''}`}></div>
    </>
  );
}
