import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate, useOutletContext } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import waitAMinute from '../utils/waitAMinute';
import calculatePrice from '../scripts/calculatePrice';
import styles from '../styles/Details.module.scss';

type Image = {
  id: number;
  name: string;
  image: string;
  ki: string;
};

type DataType = {
  id: number;
  name: string;
  image: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  quantity: number;
  originPlanet: {
    name: string;
    destroyed: boolean;
    image: string;
    description: string;
  };
  transformations: [];
};

// eslint-disable-next-line react-refresh/only-export-components
export function loader({ params }: LoaderFunctionArgs) {
  return { query: params.id };
}

function Image({ image, name, rotateY }: { image: string; name: string; rotateY: number }) {
  return (
    <li style={{ transform: `rotateY(${rotateY}deg) translateZ(500px) scale(0.5)` }}>
      <img
        src={image}
        alt={name + ' image'}
      />
    </li>
  );
}

type PropType = {
  purchases: DataType[];
  onClickAddItem: (updater: (prevItems: DataType[]) => DataType[]) => void;
  onMessage: (msg: { id: string; message: string; type: string }) => void;
  onLoading: (newValue: boolean) => boolean;
};

async function loadData(q: string) {
  const res = await fetch(`https://dragonball-api.com/api/characters/${q}`);
  const data: DataType = await res.json();
  await waitAMinute();
  return data;
}

export default function Details() {
  const { query }: { query: string } = useLoaderData() as { query: string };
  const [data, setData] = useState<DataType | null>(null);
  const navigate = useNavigate();
  const { purchases, onLoading, onClickAddItem, onMessage }: PropType = useOutletContext();

  const [indexDotActive, setIndexDotActive] = useState(0);
  const sliderRef: { current: HTMLUListElement | null } = useRef(null);
  const angleRef: { current: number } = useRef(0);
  const dotWrapperRef: { current: HTMLDivElement | null } = useRef(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    let ignore = false;
    onLoading(true);
    setData(null);
    async function getData(q: string) {
      const data = await loadData(q);
      if (ignore) return;
      setData(data);
      onLoading(false);
    }
    getData(query);
    return () => {
      ignore = true;
      onLoading(false);
    };
  }, [query, onLoading]);

  if (!data) return;

  let imgs: Image[] = [];
  if (Array.isArray(data.transformations)) {
    imgs = [{ id: data.id, name: data.name, image: data.image, ki: data.ki }, ...data.transformations];
  } else {
    imgs = [{ id: data.id, name: data.name, image: data.image, ki: data.ki }];
  }

  const price = calculatePrice(data.ki);
  const offsetLeft = dotWrapperRef.current
    ? (dotWrapperRef.current.children[indexDotActive] as HTMLElement).offsetLeft
    : null;

  function handleTransition(newIndex: number) {
    setIndexDotActive(newIndex);
    if (sliderRef.current) sliderRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
  }

  function handleClickPrev() {
    angleRef.current += 360 / imgs.length;
    handleTransition(indexDotActive === 0 ? imgs.length - 1 : indexDotActive - 1);
  }

  function handleClickNext() {
    angleRef.current -= 360 / imgs.length;
    handleTransition(indexDotActive === imgs.length - 1 ? 0 : indexDotActive + 1);
  }

  function handleClickDot(e: React.MouseEvent) {
    const index = Number.parseInt((e.target as HTMLElement).dataset.index || '0', 10);
    angleRef.current =
      index - indexDotActive < 0
        ? angleRef.current + (360 / imgs.length) * (indexDotActive - index)
        : angleRef.current - (360 / imgs.length) * (index - indexDotActive);
    handleTransition(index);
  }

  function handleAddItem(product: DataType) {
    const existingItem = purchases.find((purchase: DataType) => purchase.id === product.id);
    let message = { id: uuidv4(), message: 'Added to cart', type: 'success' };
    if (existingItem && existingItem.quantity >= 20) message = { id: uuidv4(), message: 'Sold out', type: 'sold out' };

    onClickAddItem((prevItems: DataType[]) => {
      if (existingItem === undefined) {
        return [...prevItems, { ...product, quantity: 1 }];
      } else {
        if (existingItem.quantity >= 20) {
          return prevItems;
        }
        return prevItems.map((purchase: DataType) =>
          purchase.id === product.id ? { ...purchase, quantity: purchase.quantity + 1 } : purchase
        );
      }
    });

    onMessage(message);
  }

  return (
    <div className={styles.details}>
      <div className={styles.character}>
        <header className={styles.header}>
          <button
            onClick={() => navigate(-1)}
            className={styles.back}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <div>
            <h2>{data.name}</h2>
          </div>
        </header>

        <main className={styles.main}>
          <div
            className={styles.sliderContainer}
            style={{ backgroundImage: `url(${data.originPlanet.image})` }}
          >
            <ul
              className={styles.slider}
              ref={sliderRef}
            >
              {imgs.map((img, index) => {
                const rotateY = index * (360 / imgs.length);
                return (
                  <Image
                    key={index}
                    image={img.image}
                    name={img.name}
                    rotateY={rotateY}
                  />
                );
              })}
            </ul>
            {imgs.length > 2 && (
              <>
                <FontAwesomeIcon
                  className={styles.icon + ' ' + styles.prev}
                  icon={faChevronLeft}
                  onClick={handleClickPrev}
                />
                <FontAwesomeIcon
                  className={styles.icon + ' ' + styles.next}
                  icon={faChevronRight}
                  onClick={handleClickNext}
                />
                <div className={styles.dotContainer}>
                  <div
                    className={styles.dotWrapper}
                    ref={dotWrapperRef}
                  >
                    {imgs.map((_, index) => (
                      <div
                        onClick={handleClickDot}
                        data-index={index}
                        key={index}
                        className={`${styles.dot} ${indexDotActive === index ? styles.active : ''}`}
                      ></div>
                    ))}
                  </div>
                  <div
                    style={
                      {
                        '--offset-left': (offsetLeft || 16) + 'px',
                      } as React.CSSProperties
                    }
                    className={`${styles.dot} ${styles.translate}`}
                  ></div>
                </div>
              </>
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.purchase}>
              <span className={styles.price}>${price}</span>
              <button
                onClick={() => handleAddItem(data)}
                className={styles.btnAdd}
              >
                Add to cart +
              </button>
            </div>

            <div className={styles.mainInfo}>
              <h2>
                Name: <span>{imgs[indexDotActive].name}</span>
              </h2>
              <p>
                Race: <span>{data.race}</span>
              </p>
              <p>
                Gender: <span>{data.gender}</span>
              </p>
              <p>
                Ki: <span>{imgs[indexDotActive].ki}</span>
              </p>
              <p>
                Max ki: <span>{data.maxKi}</span>
              </p>
            </div>

            <div className={styles.desc}>
              <h2>Description</h2>
              <p>{data.description}</p>
            </div>

            <div className={`${styles.more} ${showMore ? styles.show : ''}`}>
              <div className={styles.planetInfo}>
                <h2>Origin Planet</h2>
                <p>
                  Name: <span>{data.originPlanet.name}</span>
                </p>
                <p>
                  Destroyed: <span>{data.originPlanet.destroyed ? 'Yes' : 'No'}</span>
                </p>
                <img
                  src={data.originPlanet.image}
                  alt={data.originPlanet.name + ' plant image'}
                />
                <p>{data.originPlanet.description}</p>
              </div>

              <button onClick={() => setShowMore(!showMore)}>
                <span>
                  {showMore ? 'Hide' : 'More'}
                  {!showMore ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className={styles.bgc}></div>
    </div>
  );
}
