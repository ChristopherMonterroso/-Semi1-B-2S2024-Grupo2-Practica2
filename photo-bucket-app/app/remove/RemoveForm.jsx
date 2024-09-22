"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./RemoveForm.module.css";
import { remove } from "./../services/remove";
import { login } from "../services/login";
import Cookies from "js-cookie";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === "local";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))?.user || Cookies.get("user");

    if (!storedUser) {
      const redirectUrl = isLocal ? "/login" : "/login.html";
      router.push(redirectUrl);
    } else {
      setUser(storedUser);
      setIsLoading(false);
    }
  }, [router, isLocal]);

  const handleRegresar = () => {
    const redirectUrl = isLocal ? "/account" : "/account.html";
    router.push(redirectUrl);
  };

  const handleRemove = async () => {
    setError(null);

    try {
      const result = await remove(user.id_user, password);
      console.log("result2", result);
      if (result.status) {
        localStorage.removeItem("user");
        Cookies.remove("user");
        // router.push("/login");
        // const redirectUrl = isLocal ? "/login" : "/login.html";
        // router.push(redirectUrl);
      } else {
        setError(`Ocurrió un error. ${result.message}`);
      }
    } catch (error) {
      setError("Error al eliminar la cuenta. Intente de nuevo.");
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.Containertitle}>
        <div className={styles.title}>
          <h2>Eliminacion de cuenta</h2>
        </div>
        <div className={styles.ContainerP}>
          <p>
            La eliminacion de la cuenta es irreversible, si estas seguro de
            realizar la accion, ingrese su contraseña para verificar su
            identidad.
          </p>
        </div>
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>

        <div>
          <button className={styles.button} onClick={handleRemove}>
            Eliminar cuenta
          </button>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={handleRegresar}
          >
            Regresar
          </button>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
