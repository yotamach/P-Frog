import React, { useEffect, useState } from 'react';
import { Message } from '@p-frog/api-interfaces';
import styles from './app.module.scss';
import {Header, Main} from '../components';

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <>
      <Header />
      <Main />
    </>
  );
};

export default App;
