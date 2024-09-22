'use client';
import ProfileForm from './ProfileForm';
import styles from './LoginPage.module.css';
import '../globals.css';

export default function ProfilePage() {
  return (

    <main className={styles.container}>
      <div className={styles.formContainer}>
      <ProfileForm />
      </div>
    </main>
  );
}
