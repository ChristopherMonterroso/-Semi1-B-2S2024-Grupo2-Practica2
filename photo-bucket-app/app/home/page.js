'use client';
import { useState, useEffect } from 'react';
import EditAlbum from '../components/EditAlbum';
import Albumnes from './../components/Albums';
import TextExtractor from '../components/TextExtractor';
import UploadImage from '../components/UploadImage';
import styles from './HomePage.module.css';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const HomePage = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showButtons, setShowButtons] = useState(true);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))?.user;
    
    if (!storedUser) {
      const redirectUrl = isLocal ? '/login' : '/login.html';
      router.push(redirectUrl);
    } else {
      setUser(storedUser);
      setLoading(false);
    }
  }, [router, isLocal]);

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    setShowButtons(false);
  };

  const handleShowButtons = () => {
    setSelectedComponent(null);
    setShowButtons(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('user');
    const redirectUrl = isLocal ? '/login' : '/login.html';
    router.push(redirectUrl);
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.leftSide}>
        <img
          src={user.profile_image_url}
          alt="Profile"
          className={styles.profileImage}
        />
        <h3>Nombre de usuario: {user.username}</h3>
        <p>Correo electrónico: {user.email}</p>
      </div>

      <div className={styles.rightSide}>
        {showButtons ? (
          <>
            <button onClick={() => handleComponentChange('editAlbum')} className={styles.button}>
              Editar álbumes
            </button>
            <button onClick={() => handleComponentChange('viewAlbums')} className={styles.button}>
              Ver álbumes
            </button>
            <button onClick={() => handleComponentChange('uploadImage')} className={styles.button}>
              Subir imagen
            </button>
            <button onClick={() => handleComponentChange('textExtractor')} className={styles.button}>
              Extraer texto
            </button>
            <button 
              onClick={() => router.push(isLocal ? '/account' : '/account.html')} 
              className={styles.button}
            >
              Configuración de la cuenta
            </button>
            <button onClick={handleLogout} className={styles.button}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <div className={styles.componentContainer}>
              {selectedComponent === 'editAlbum' && <EditAlbum />}
              {selectedComponent === 'uploadImage' && <UploadImage />}
              {selectedComponent === 'textExtractor' && <TextExtractor />}
              {selectedComponent === 'viewAlbums' && <Albumnes id_user={user.id_user} />}
              {/* Aquí puedes agregar más componentes según sea necesario */}
            </div>
            <button onClick={handleShowButtons} className={styles.backButton}>
              Regresar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
