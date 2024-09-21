'use client';
import { useRouter } from 'next/navigation';
import styles from './Account.module.css';

const Account = () => {
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';

  const handleBackToHome = () => {
    const redirectUrl = isLocal ? '/home' : '/home.html';
    router.push(redirectUrl);
  };

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
