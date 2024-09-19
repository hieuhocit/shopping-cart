import styles from '../styles/Search.module.scss';
import { NavLink } from 'react-router-dom';

type Purchase = {
  id: number;
  quantity: number;
  ki: string;
  image: string;
  name: string;
  race: string;
  gender: string;
};

export default function CardInSearch({ character, onClear }: { character: Purchase; onClear: () => void }) {
  return (
    <li className={styles.card}>
      <NavLink
        to={`/shop/characters/character/${character.id}`}
        onClick={onClear}
      >
        <div>
          <img
            src={character.image}
            alt={character.name + ' image'}
            loading='lazy'
          />
        </div>
        <p>{character.name}</p>
      </NavLink>
    </li>
  );
}
