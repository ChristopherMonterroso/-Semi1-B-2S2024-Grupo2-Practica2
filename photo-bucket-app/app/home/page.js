'use client';
import { useState } from 'react';
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
  const router = useRouter(); 

  // Obtener la información del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('user'))?.user;

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    setShowButtons(false); // Ocultar los botones cuando se selecciona un componente
  };

  const handleShowButtons = () => {
    setSelectedComponent(null); // Reinicia el componente seleccionado
    setShowButtons(true); // Mostrar los botones nuevamente
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('user');
    router.push('/login');
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.leftSide}>
        <img
          src={user?.profile_image_url}
          alt="Profile"
          className={styles.profileImage}
        />
        <h3>Nombre de usuario: {user?.username}</h3>
        <p>Correo electrónico: {user?.email}</p>
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
            <button onClick={() => router.push('/account')} className={styles.button}>
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
              Volver a mostrar los botones
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
