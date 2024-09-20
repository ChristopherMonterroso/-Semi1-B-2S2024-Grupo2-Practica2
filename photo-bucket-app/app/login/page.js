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
      toast.success('Inicio de sesión exitoso');
      console.log('Login successful:', data);
      localStorage.setItem('user', JSON.stringify(data));
      Cookies.set('user', JSON.stringify(data), { expires: 1 });
      router.push('/home'); // Redirigir a la página de inicio
    } catch (error) {
      toast.error('Credenciales incorrectas');
      console.error(error);
    }
  };

  const handleFaceRecognitionClick = () => {
    setIsFaceRecognition(true);
  };

  const handleBackToLogin = () => {
    setIsFaceRecognition(false);
  };

  const userHasFaceRecognitionConfigured = () => {
    // Aquí debes implementar la lógica para verificar si el usuario tiene habilitado el reconocimiento facial
    return false; // Cambia esto según tu lógica
  };

  return (
    <div className={styles.loginContainer}>
      <ToastContainer />
      <h1>PhotoBucket</h1>
      <h2>Inicio de sesión</h2>
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
          <p>
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
