'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../services/register';
import styles from './RegisterForm.module.css';
import ProfilePictureUpload from './ProfilePictureUpload';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const data = await register(username, email, password, profilePhoto);
        if (data.status) {
          router.push('/login');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Error al registrar el usuario');
        console.error(error);
      }
    } else {
      toast.error('Las contraseñas no coinciden');
    }
  };

  return (
    <div className={styles.formContainer}>
      <ProfilePictureUpload onImageChange={setProfilePhoto} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Registrarse</button>

        <p className={styles.centerText}>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
      </form>
    </div>
  );
};

export default RegisterForm;
