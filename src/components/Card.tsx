import { useOutletContext, NavLink } from 'react-router-dom';
import calculatePrice from '../scripts/calculatePrice.ts';
import styles from '../styles/Product.module.scss';
import { v4 as uuidv4 } from 'uuid';

type Purchase = {
  id: number;
  quantity: number;
  ki: string;
  image: string;
  name: string;
  race: string;
  gender: string;
};

type PropType = {
  purchases: Purchase[];
  onClickAddItem: (updater: (prevItems: Purchase[]) => Purchase[]) => void;
  onMessage: (msg: { id: string; message: string; type: string }) => void;
};

export default function Product({ product }: { product: Purchase }) {
  const price = calculatePrice(product.ki);
  const { purchases, onClickAddItem, onMessage }: PropType = useOutletContext();

  function handleAddItem(product: Purchase) {
    const existingItem = purchases.find((purchase: Purchase) => purchase.id === product.id);
    let message = { id: uuidv4(), message: 'Added to cart', type: 'success' };
    if (existingItem && existingItem.quantity >= 20) message = { id: uuidv4(), message: 'Sold out', type: 'sold out' };

    onClickAddItem((prevItems: Purchase[]) => {
      if (existingItem === undefined) {
        return [...prevItems, { ...product, quantity: 1 }];
      } else {
        if (existingItem.quantity >= 20) {
          return prevItems;
        }
        return prevItems.map((purchase: Purchase) =>
          purchase.id === product.id ? { ...purchase, quantity: purchase.quantity + 1 } : purchase
        );
      }
    });

    onMessage(message);
  }

  return (
    <div className={styles.product}>
      <NavLink to={'/characters/character/' + product.id}>
        <div className={styles.imgContainer}>
          <img
            src={product.image}
            alt={product.name + ' image'}
            loading='lazy'
          />
        </div>

        <div className={styles.introduction}>
          <p className={styles.name}>{product.name}</p>
          <p className={styles.raceGender}>
            <span className={styles.race}>{product.race}</span> -{' '}
            <span className={styles.gender}>{product.gender}</span>
          </p>
        </div>
      </NavLink>
      <div className={styles.priceContainer}>
        <button
          onClick={() => handleAddItem(product)}
          className={styles.btnAdd}
        >
          Add to cart +
        </button>
        <span className={styles.price}>${price}</span>
      </div>
    </div>
  );
}
