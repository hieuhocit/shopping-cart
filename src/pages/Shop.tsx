import styles from '../styles/Shop.module.scss';
import Card from '../components/Card';
import { LoaderFunctionArgs, useLoaderData, useOutletContext } from 'react-router-dom';
import waitAMinute from '../utils/waitAMinute';
import { useEffect, useState } from 'react';

type Purchase = {
  id: number;
  quantity: number;
  ki: string;
  image: string;
  name: string;
  race: string;
  gender: string;
};
type Data = { items?: Purchase[] };

// eslint-disable-next-line react-refresh/only-export-components
export function loader({ params }: LoaderFunctionArgs) {
  const q = params.query === 'all' ? '' : params.query;
  return { query: q };
}

async function loadData(query: string) {
  const res = await fetch(`https://dragonball-api.com/api/characters?name=${query}&limit=58`);
  const data: Data = await res.json();
  await waitAMinute();
  if (data.items) return data.items;
  else return data as [];
}

export default function Shop() {
  const { query }: { query: string } = useLoaderData() as { query: string };
  const { onLoading }: { onLoading: (newValue: boolean) => boolean } = useOutletContext();
  const [data, setData] = useState<Purchase[] | null>(null);

  useEffect(() => {
    let ignore = false;
    setData(null);
    onLoading(true);
    async function getData(q: string): Promise<void> {
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

  return (
    <div className={`${styles.shop}`}>
      <div className={styles.items}>
        {data.length > 0 &&
          data.map((product) => (
            <Card
              key={product.id}
              product={product}
            />
          ))}
      </div>
      {data.length <= 0 && <h1 style={{ color: 'white' }}>No characters found</h1>}
    </div>
  );
}
