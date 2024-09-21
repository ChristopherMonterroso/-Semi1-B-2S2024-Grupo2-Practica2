'use client';
import styles from './Modal.module.css';

const Modal = ({ onClose, onSubmit, password, setPassword }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Confirme su Contraseña</h2>
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder='Contraseña'
        />
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={onSubmit}>
            Confirmar
          </button>
          <button className={styles.button} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
