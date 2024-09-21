'use client';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './FaceRecognition.module.css';
import { loginWithFaceRecognition } from '../services/login';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const FaceRecognition = ({ onBackToLogin }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing camera: ', err);
        toast.error('No se pudo acceder a la cámara. Verifique la configuración de su dispositivo.');
      }
    };

    getVideoStream();
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedImage = canvas.toDataURL('image/jpeg');
    setImageData(capturedImage);
    toast.success('Foto capturada. Ahora puedes enviar el formulario.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!imageData || !usernameOrEmail) {
      toast.error('Por favor captura una foto y proporciona un nombre de usuario/correo electrónico.');
      return;
    }

    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);
      
      const formData = new FormData();
      const blob = await fetch(imageData).then((res) => res.blob());
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      
      formData.append('image', file);

      if (isEmail) {
        formData.append('email', usernameOrEmail);
      } else {
        formData.append('username', usernameOrEmail);
      }

      const data = await loginWithFaceRecognition(formData);

      if (data.status) {
        localStorage.setItem('user', JSON.stringify(data));
        Cookies.set('user', JSON.stringify(data), { expires: 1 });
        router.push('/home');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error durante el inicio de sesión.');
    }
  };

  return (
    <div className={styles.faceRecognitionContainer}>
      <h2>Iniciar sesión con reconocimiento facial</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="usernameOrEmail">Nombre de usuario o correo electrónico</label>
        <input
          type="text"
          id="usernameOrEmail"
          name="usernameOrEmail"
          placeholder="Nombre de usuario o correo electrónico"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
          className={styles.input}
        />
        
        <div>
          <video ref={videoRef} width="320" height="240" autoPlay className={styles.video}></video>
          <button type="button" onClick={capturePhoto} className={styles.button}>
            Capturar foto
          </button>
          <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>
        </div>
        
        <button type="submit" className={styles.button}>Iniciar sesión</button>
        <button type="button" onClick={onBackToLogin} className={styles.backButton}>
          Volver al inicio de sesión
        </button>
      </form>
    </div>
  );
};

export default FaceRecognition;
