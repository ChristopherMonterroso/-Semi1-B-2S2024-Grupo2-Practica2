'use client';
import { useState } from 'react';
import { login } from '../services/login';
import styles from './LoginPage.module.css';
import FaceRecognition from './FaceRecognition';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFaceRecognition, setIsFaceRecognition] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(usernameOrEmail, password);
      if (data.status) {
        localStorage.setItem('user', JSON.stringify(data));
        Cookies.set('user', JSON.stringify(data), { expires: 1 });
        router.push('/home');
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error('Ocurrió un error, intente de nuevo.');
      console.error(error);
    }
  };

  const handleFaceRecognitionClick = () => {
    setIsFaceRecognition(true);
  };

  const handleBackToLogin = () => {
    setIsFaceRecognition(false);
  };

  return (
    <div className={styles.loginContainer}>
      <ToastContainer />
      <div className={styles.title}>PhotoBucket</div>
      {/* Agrega la imagen del logo aquí */}
      <img src="/images/logo.png" alt="Logo" className={styles.logo} />
      {!isFaceRecognition ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de usuario o correo electrónico"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Iniciar sesión</button>
          <button type="button" onClick={handleFaceRecognitionClick} className={styles.button}>
            Utilizar reconocimiento facial
          </button>
          <p className={styles.centerText}>
            ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </form>
      ) : (
        <FaceRecognition onBackToLogin={handleBackToLogin} />
      )}
    </div>
  );
};

export default LoginPage;
