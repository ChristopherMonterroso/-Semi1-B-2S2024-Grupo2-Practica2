'use client';
import { useState, useEffect } from 'react';
import { login } from '../services/login';
import styles from './LoginPage.module.css';
import FaceRecognition from './FaceRecognition';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const SetingFace = () => {
  

  return (
    <div className={styles.loginContainer}>
        <FaceRecognition/>
    </div>
  );
};

export default SetingFace;
