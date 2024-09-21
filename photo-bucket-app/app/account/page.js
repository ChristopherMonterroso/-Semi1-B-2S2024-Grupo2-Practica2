'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Account.module.css';
import Cookies from 'js-cookie';

const Account = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))?.user || Cookies.get('user');
    
    if (!storedUser) {
      const redirectUrl = isLocal ? '/login' : '/login.html';
      router.push(redirectUrl);
    } else {
      setIsLoading(false);
    }
  }, [router, isLocal]);

  const handleBackToHome = () => {
    const redirectUrl = isLocal ? '/home' : '/home.html';
    router.push(redirectUrl);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.accountContainer}>
      <h2>Configuración de la cuenta</h2>
      
      <div className={styles.buttonsContainer}>
        <button className={styles.button}>
          Editar información personal
        </button>
        <button className={styles.button}>
          Configurar reconocimiento facial
        </button>
        <button className={styles.buttonDelete}>
          Eliminar cuenta
        </button>
        <button className={styles.backButton} onClick={handleBackToHome}>
          Regresar
        </button>
      </div>
    </div>
  );
};

export default Account;
