'use client';
import RemoveForm from './RemoveForm';
import styles from './LoginPage.module.css';
import '../globals.css';

export default function RemovePage() {
  return (

    <main className={styles.container}>
      <div className={styles.formContainer}>
      <RemoveForm />
      </div>
    </main>
  );
}
