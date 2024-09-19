import styles from './styles/App.module.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons';
library.add(fas, far, faTwitter, faFontAwesome);

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Cart from './components/Cart';
import Message from './components/Message';
import Loading from './components/Loading';
import videoBgc from './assets/videos/background.mp4';

type Purchase = {
  id: number;
  quantity: number;
  ki: string;
  image: string;
  name: string;
  race: string;
  gender: string;
};

function App() {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [purchases, setPurchase] = useState<Purchase[]>([]);
  const [messages, setMessages] = useState<{ id: string; message: string; type: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  function handleClickCart() {
    setOpenCart(!openCart);
  }

  function handleRemoveMessage(id: string) {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  }

  function handleAddMessage(msg: { id: string; message: string; type: string }) {
    setMessages((prevMessages) => [...prevMessages, msg]);
  }

  return (
    <div className={`${styles.app}`}>
      <Header
        onClickCart={handleClickCart}
        notices={purchases.length}
      />
      <main className={styles.main}>
        {loading && <Loading />}
        <Outlet context={{purchases:purchases, onLoading: setLoading, onClickAddItem: setPurchase, onMessage: handleAddMessage }} />
      </main>
      <Sidebar />
      <Cart
        open={openCart}
        purchases={purchases}
        onClickCloseCart={handleClickCart}
        onClickAddItem={setPurchase}
      />
      {messages.length > 0 &&
        messages.map((msg, index) => {
          return (
            <Message
              key={msg.id}
              index={index}
              {...msg}
              onRemoveMessage={handleRemoveMessage}
            />
          );
        })}
      <div className={styles.videoContainer}>
        {location.pathname === '/' && (
          <video
            src={videoBgc}
            muted={true}
            autoPlay
            loop
          ></video>
        )}
      </div>
    </div>
  );
}

export default App;
