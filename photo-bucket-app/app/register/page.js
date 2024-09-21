'use client';
import RegisterForm from './RegisterForm';
import styles from './RegisterPage.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.title}>PhotoBucket</div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
