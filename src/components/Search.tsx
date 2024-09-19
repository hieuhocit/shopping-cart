import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import CardInSearch from './CardInSearch';
import Loading from './Loading';
import styles from '../styles/Search.module.scss';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';

async function loadCharacters(q: string) {
  const res = await fetch(`https://dragonball-api.com/api/characters?name=${q.trim()}`);
  const data = await res.json();
  if (data.items) {
    return data.items;
  } else {
    return data;
  }
}

type Purchase = {
  id: number;
  quantity: number;
  ki: string;
  image: string;
  name: string;
  race: string;
  gender: string;
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false);
  const [data, setData] = useState<Purchase[]>([]);
  const idTimeoutRef = useRef<number | null>(null);
  const searchRef = useRef<HTMLFormElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && searchRef.current.contains(e.target as HTMLElement)) return;
      setShow(false);
    }
    document.documentElement.addEventListener('click', handleClick);
    return () => document.documentElement.removeEventListener('click', handleClick);
  }, []);

  function handleOnchange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setShow(true);
  }

  function handlePointerDown() {
    if (query === '') return;
    setShow(true);
  }

  function handleKeyUp() {
    setIsLoading(true);
    if (idTimeoutRef.current) clearTimeout(idTimeoutRef.current);
    idTimeoutRef.current = setTimeout(async () => {
      const characters = await loadCharacters(query);
      setData(characters);
      setIsLoading(false);
    }, 500);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim() === '') navigate(`/shop/characters/all`);
    else navigate(`/shop/characters/${query.trim()}`);
    setInitialState();
  }

  function setInitialState() {
    if (idTimeoutRef.current) clearTimeout(idTimeoutRef.current);
    setQuery('');
    setShow(false);
    setData([]);
    idTimeoutRef.current = null;
  }

  return (
    <form
      className={styles.search}
      ref={searchRef}
      onSubmit={handleSubmit}
    >
      <input
        type='text'
        name='search'
        autoComplete='off'
        placeholder='Search characters...'
        value={query}
        onChange={handleOnchange}
        onPointerDown={handlePointerDown}
        onKeyUp={handleKeyUp}
      />
      <button type='submit'>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={styles.icon}
        />
      </button>

      <div className={`${styles.resultContainer} ${show ? styles.show : ''}`}>
        {isLoading ? (
          <Loading />
        ) : (
          <ul className={styles.result}>
            {data?.length > 0 ? (
              data.map((character) => (
                <CardInSearch
                  key={character.id}
                  character={character}
                  onClear={setInitialState}
                />
              ))
            ) : (
              <h1>No characters found</h1>
            )}
          </ul>
        )}
      </div>
    </form>
  );
}
