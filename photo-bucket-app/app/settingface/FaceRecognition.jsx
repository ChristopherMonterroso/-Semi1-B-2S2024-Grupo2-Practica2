"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styles from "./LoginPage.module.css";
import { loginWithFaceRecognition } from "../services/login";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button, Box } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { GetRecognition } from "../services/getFace";
import { updateFaceRecog } from "../services/updateFace";

const FaceRecognition = () => {
  const videoRef = useRef(null);

  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [faceimage, setFaceimage] = useState(null);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [showcamera, setShowCamera] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isOn, setIsOn] = useState(false);
  const isLocal = process.env.NEXT_PUBLIC_HOST === "local";

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user"))?.user || Cookies.get("user");

    if (!storedUser) {
      const redirectUrl = isLocal ? "/login" : "/login.html";
      router.push(redirectUrl);
    } else {
      setUser(storedUser);
      GetFaceRecognition(storedUser.id_user);
      setLoading(false);
    }
  }, [router, isLocal]);

  const GetFaceRecognition = async (id) => {
   
    try {
      const data = await GetRecognition(id);
      if (data.status) {
        setIsOn(data.facialRecognition.status);
        setFaceimage(data.facialRecognition);
      } else {
        setIsOn(false);
        setFaceimage(null);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Ocurrió un error al obtener la imagen face.");
    }
  };

  const getVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera: ", err);
      toast.error(
        "No se pudo acceder a la cámara. Verifique la configuración de su dispositivo."
      );
    }
  };

  const ActiveCamera = () => {
    setShowCamera(true);
    getVideoStream();
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedImage = canvas.toDataURL("image/jpeg");
    setImageData(capturedImage);
    toast.success("Foto capturada. Ahora puedes enviar el formulario.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageData) {
      toast.error(
        "Por favor captura una foto y proporciona un nombre de usuario/correo electrónico."
      );
      return;
    }

    try {
      const formData = new FormData();
      const blob = await fetch(imageData).then((res) => res.blob());
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      formData.append("image", file);
      formData.append("password", password);
      formData.append("status", isOn);

      const data = await updateFaceRecog(user.id_user, formData);
    
      if (data.status) {
        toast.success("Reconocimiento facial actualizado correctamente.");
        const redirectUrl = isLocal ? "/account" : "/account.html";
        router.push(redirectUrl);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocurrió un error durante la actualizacion.");
    }
  };

  const togglePower = () => {
    setIsOn(!isOn);
  };

  const handleBackAccount = () => {
    const redirectUrl = isLocal ? "/account" : "/account.html";
    router.push(redirectUrl);
  };

  if (loading) {
    return null;
  }

  return (
    <div className={styles.contaiener}>
      <ToastContainer />
      <div className={styles.title}>
        <h2>Reconomiento facial</h2>
      </div>

      <div className={styles.homePage}>
        {showcamera ? (
          <div className={styles.videoContainer}>
            <video
              ref={videoRef}
              width="320"
              height="240"
              autoPlay
              className={styles.video}
            ></video>
            <button
              type="button"
              onClick={capturePhoto}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Capturar foto
            </button>
            <canvas
              ref={canvasRef}
              width="320"
              height="240"
              style={{ display: "none" }}
            ></canvas>
          </div>
        ) : (
          <div className={styles.fotoactual}>
            <p>fotografica clave actual</p>

            <div className={styles.leftSide}>
              <img
                src={faceimage ? faceimage.facial_image_url : "usuario.png"}
                alt="Profile"
                className={styles.profileImage}
              />
            </div>
          </div>
        )}

        <div className={styles.faceRecognitionContainer}>
          <div className={styles.containeractive}>
            <div className={styles.parrafo}>
              <p>Uso de reconocimiento facial para autenticarse</p>
            </div>
            <div className={styles.containerbutton}>
              <Box
                onClick={togglePower}
                sx={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: isOn ? "#4caf50" : "#f44336",
                }}
              >
                <PowerSettingsNewIcon style={{ fontSize: "15px" }} />
              </Box>
            </div>
          </div>

          <div className={styles.formWrapper}>
            <div className={styles.formGroup}>
              <button
                type="button"
                onClick={ActiveCamera}
                className={`${styles.button} ${styles.backButton}`}
              >
                modificar fotografica clave
              </button>

              <p>Contraseña</p>
              <input
                className={styles.input}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />

              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={handleSubmit}
              >
                Guarar cambios
              </button>
              <button className={styles.button} onClick={handleBackAccount}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
