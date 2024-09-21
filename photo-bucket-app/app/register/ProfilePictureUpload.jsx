import { useState, useRef } from 'react';
import styles from './ProfilePictureUpload.module.css';

const ProfilePictureUpload = ({ onImageChange }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {imagePreview ? (
        <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
      ) : (
        <div className={styles.placeholder}>Selecciona una imagen</div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className={styles.fileInput}
        ref={fileInputRef}
      />
      <button type="button" onClick={handleButtonClick} className={styles.selectButton}>
        Seleccionar fotografía
      </button>
    </div>
  );
};

export default ProfilePictureUpload;
