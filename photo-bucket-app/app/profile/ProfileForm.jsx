"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileForm.module.css";
import Modal from "./Modal";
import { updateUser } from "./../services/profileService";
import { login } from "../services/login";
import Cookies from "js-cookie";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  // const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === "local";
  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))?.user || Cookies.get("user");
    // console.log("Stored User:", storedUser);
    if (!storedUser) {
      const redirectUrl = isLocal ? "/login" : "/login.html";
      router.push(redirectUrl);
    } else {
      setUser(storedUser);
      setUsername(storedUser.username);
      // setLastName(storedUser.lastName);
      setEmail(storedUser.email);
      setProfilePhoto(storedUser.profile_image_url);

      setIsLoading(false);
    }


  }, [router, isLocal]);

  const Iniciosesion = async () => {
    try {
      const loginResult = await login(email, password);
      // console.log(loginResult);
      if (loginResult.status) {
        const userData = loginResult.user;
        localStorage.setItem("user", JSON.stringify(loginResult));
        Cookies.set("user", JSON.stringify(loginResult), { expires: 1 });
        setUser(userData);
        setUsername(userData.username);
        setEmail(userData.email);
        setProfilePhoto(userData.profile_image_url);
      } else {
        setError(`Ocurrió un error al actualizar. ${loginResult.message}`);
      }
    } catch (error) {
      //   console.log("error", error);
      setError("Error al actualizar el perfil. Intente de nuevo.");
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleRegresar = () => {
    const redirectUrl = isLocal ? "/account" : "/account.html";
    router.push(redirectUrl);
  };

  const handleCancel = () => {
    setIsEditable(false);
    setProfilePhoto(user.profile_image_url);
    setUsername(user.username);
    // setLastName(user.lastName);
    setEmail(user.email);
    setPassword("");
    setError(null);
  };

  const handleSaveChanges = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    setError(null);

    const updatedUser = new FormData();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username != user.username) {
      updatedUser.append("username", username);
    }
    if (email != user.email) {
      if (emailRegex.test(email)) {
        updatedUser.append("email", email);
      } else {
        setError("Por favor, ingresa un correo electrónico válido.");
        setLoading(false);
        setIsModalOpen(false);
        return; // Detener la ejecución si el correo no es válido
      }
    }

    if (profilePhoto) {
      updatedUser.append("profile_image", profilePhoto);
    }
    updatedUser.append("password", password);

    //   console.log("updatedUser", username, email, password, profilePhoto);
    try {
      const result = await updateUser(user.id_user, updatedUser);
      //   console.log("result2", result);
      if (result.status) {
        Iniciosesion();
      } else {
        setError(`Ocurrió un error. ${result.message}`);
      }
    } catch (error) {
      setError("Error al actualizar el perfil. Intente de nuevo.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setIsEditable(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profilePhotoWrapper}>
        <img
          src={profilePhoto}
          alt="Profile Photo"
          className={styles.profilePhoto}
        />
        {isEditable && (
          <input
            className={styles.inputFile}
            type="file"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
        )}
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!isEditable}
            placeholder="username"
          />
        </div>
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditable}
            placeholder="correo electronico"
          />
        </div>
        {isEditable ? (
          <>
            <button
              className={styles.button}
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button className={styles.button} onClick={handleEdit}>
              Editar Perfil
            </button>
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleRegresar}>
              Regresar
            </button>
          </>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          password={password}
          setPassword={setPassword}
        />
      )}
    </div>
  );
};

export default ProfilePage;
