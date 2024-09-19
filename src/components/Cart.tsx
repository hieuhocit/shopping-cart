import styles from '../styles/Cart.module.scss';
import CardInCard from './CardInCart';
import calculatePrice from '../scripts/calculatePrice';

type Purchase = {
  id: number;
  quantity: number;
  ki: string;
  image: string;
  name: string;
  race: string;
  gender: string;
};

export default function Cart({
  open,
  purchases,
  onClickCloseCart,
  onClickAddItem,
}: {
  open: boolean;
  purchases: Purchase[];
  onClickCloseCart: () => void;
  onClickAddItem: (updater: (prevItems: Purchase[]) => Purchase[]) => void;
}) {
  function handleClearPurchases() {
    onClickAddItem(() => []);
  }

  return (
    <div className={`${styles.cartContainer} ${open ? styles.open : ''}`}>
      <div className={styles.cart}>
        <header>
          <h2>{purchases.length} Cards</h2>
          <button onClick={handleClearPurchases}>Clear</button>
        </header>

        <main>
          <ul className={styles.cards}>
            {purchases.map((p) => (
              <CardInCard
                key={p.id}
                product={p}
                onClickAddItem={onClickAddItem}
                onClickCloseCart={onClickCloseCart}
              />
            ))}
          </ul>
        </main>

        <footer>
          <p>Total: ${purchases.reduce((acc, p) => acc + calculatePrice(p.ki) * p.quantity, 0)}</p>
        </footer>
      </div>
      <div
        onClick={onClickCloseCart}
        className={styles.overlay}
      ></div>
    </div>
  );
}
