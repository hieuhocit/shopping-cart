import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, KeyboardEvent } from 'react';
import { NavLink } from 'react-router-dom';
import calculatePrice from '../scripts/calculatePrice';
import styles from '../styles/Cart.module.scss';

type Purchase = {
  id: number;
  quantity: number;
  ki: string;
  image: string;
  name: string;
  race: string;
  gender: string;
};

export default function CardInCard({
  product,
  onClickAddItem,
  onClickCloseCart,
}: {
  product: Purchase;
  onClickAddItem: (updater: (prevValue: Purchase[]) => Purchase[]) => void;
  onClickCloseCart: () => void;
}) {
  function handleChangeQuantity(e: ChangeEvent<HTMLInputElement> | KeyboardEvent) {
    const q = Number.parseInt((e.target as HTMLInputElement).value);
    if (Number.isSafeInteger(q) && q <= 20) {
      onClickAddItem((prevItems) => prevItems.map((p) => (p.id === product.id ? { ...p, quantity: q } : p)));
    }
    if ((e as KeyboardEvent).key === 'Backspace' && q < 10) {
      handleDeleteItem();
    }
  }

  function handleIncreaseQuantity() {
    // Cannot increase quantity if it sold out
    if (product.quantity < 20) {
      onClickAddItem((prevItems) =>
        prevItems.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p))
      );
    }
  }

  function handleDecreaseQuantity() {
    if (product.quantity <= 1) {
      handleDeleteItem();
    }
    if (product.quantity > 0) {
      onClickAddItem((prevItems) =>
        prevItems.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p))
      );
    }
  }

  function handleDeleteItem() {
    onClickAddItem((prevItems) => prevItems.filter((p) => p.id !== product.id));
  }

  return (
    <li className={styles.card}>
      <NavLink
        to={`/characters/character/${product.id}`}
        onClick={onClickCloseCart}
        className={styles.imgContainer}
      >
        <img
          src={product.image}
          alt={product.name + ' image'}
          loading='lazy'
        />
      </NavLink>

      <div className={styles.container}>
        <NavLink
          to={`/characters/character/${product.id}`}
          onClick={onClickCloseCart}
          className={styles.name}
        >
          {product.name}
        </NavLink>
        <p className={styles.price}>${calculatePrice(product.ki)}</p>

        <div className={styles.btnGroup}>
          <button className={styles.btn}>
            <FontAwesomeIcon
              className={styles.icon}
              icon={faMinus}
              onClick={handleDecreaseQuantity}
            />
          </button>
          <input
            type='text'
            value={product.quantity}
            onChange={handleChangeQuantity}
            onKeyDown={handleChangeQuantity}
          />
          <button className={styles.btn}>
            <FontAwesomeIcon
              className={styles.icon}
              icon={faPlus}
              onClick={handleIncreaseQuantity}
            />
          </button>
        </div>
      </div>

      <button className={`${styles.btn} ${styles.delete}`}>
        <FontAwesomeIcon
          className={styles.icon}
          icon={faDeleteLeft}
          onClick={handleDeleteItem}
        />
      </button>
    </li>
  );
}
