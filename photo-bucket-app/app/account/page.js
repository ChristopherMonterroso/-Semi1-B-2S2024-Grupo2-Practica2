'use client';
import { useRouter } from 'next/navigation';
import styles from './Account.module.css';

const Account = () => {
  const router = useRouter();

  // Función para regresar a la página de inicio
  const handleBackToHome = () => {
    router.push('/home'); // Redirige a la página de inicio
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
