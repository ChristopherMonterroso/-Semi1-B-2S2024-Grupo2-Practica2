"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Modal,
  Grid,
} from "@mui/material";
import { etiquetas } from "../services/etiquetas";
import { GetImages } from "../services/images";
import { translate } from "../services/translate";

const axios = require("axios");

const Images = ({ carpeta, setSeeAlbum }) => {
  const [images, setImages] = useState([]);
  const [openmodel, setOpenModel] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [langtrans, setLangTrans] = useState([]);
  const [currentLang, setCurrentLang] = useState("");

  useEffect(() => {
    getimages();
  }, []);

  const getimages = async () => {
    try {
      const result = await GetImages(carpeta.id_album);
      if (result.status) {
        setImages(result.images);
      } else {
        console.error("No se encontraron imagenes");
        return;
      }
    } catch (error) {
      console.error("Error al obtener imagenes", error);
    }
  };

  const getetiquetas = async () => {
    try {
      // obtener la img con axios para poder meterlo al formData
      const response = await axios({
        url: imageFile.image_url,
        method: "GET",
        responseType: "arraybuffer",
      });

      const formData = new FormData();
      formData.append("image", Buffer.from(response.data));

      cnosole.log(formData);

      const result = await etiquetas(formData);
      console.log(result);
      if (result.status) {
      } else {
        console.error("No se encontraron imagenes");
        return;
      }
    } catch (error) {
      console.error("Error al obtener imagenes", error);
    }
  };

  const getLangueje = async (imagen) => {
    try {
      const result = await translate(imagen.description);
      console.log(result);
      if (result.status) {
        console.error("No se logro traduccion");
        return;
      } else {
        setLangTrans(result.translations);
      }
    } catch (error) {
      console.error("Error al traducir", error);
    }
  };

  const handleClick = (imagen) => {
    getLangueje(imagen);
    setImageFile(imagen);
    // getetiquetas();
    handleModel();
  };

  const handleModel = () => {
    setAge("");
    setCurrentLang("");
    setOpenModel(!openmodel);
  };

  const handleToBack = () => {
    setSeeAlbum(true);
  };

  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
    if (event.target.value == 1) {
      setCurrentLang(langtrans[0].translatedText);
    } else if (event.target.value == 2) {
      setCurrentLang(langtrans[1].translatedText);
    } else if (event.target.value == 3) {
      setCurrentLang(langtrans[2].translatedText);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="100vh"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "5px",
        backgroundColor: "#011F26",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: "white" }}>
          {carpeta.album_name}
        </Typography>

        <Box
          sx={{
            padding: "2px",
            borderRadius: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#5C7373",
            },
          }}
          onClick={() => handleToBack()}
        >
          <img
            src="flecha-izquierda.png" // La URL de la imagen de la carpeta
            alt="regresar" // Descripción de la imagen
            style={{
              width: "35px", // Asegura que la imagen ocupe todo el ancho del Box
              height: "35px", // Mantiene la proporción
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          overflowY: "scroll",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#011F26",
          height: "60vh",
          padding: "20px",
        }}
      >
        <Grid container spacing={3} sx={{ maxWidth: "1000px" }}>
          {images.map((imagen, index) => (
            <Grid item xs={10} sm={6} md={2} key={index}>
              <Box
                sx={{
                  padding: "15px",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#5C7373",
                  },
                }}
                onClick={() => handleClick(imagen)}
              >
                <img
                  src={imagen.image_url} // La URL de la imagen de la carpeta
                  alt={imagen.image_name} // Descripción de la imagen
                  style={{
                    width: "80px", // Asegura que la imagen ocupe todo el ancho del Box
                    height: "80px", // Mantiene la proporción
                  }}
                />
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ color: "white" }}>
                    {imagen.image_name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Modal
        open={openmodel}
        onClose={handleModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 430,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  backgroundColor: "#5C7373",
                  border: "1px solid #ccc",
                  height: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {imageFile ? (
                  <img
                    src={imageFile.image_url}
                    alt="Selected"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  "No hay imagen seleccionada"
                )}
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Etiquetas:
              </Typography>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Grid container spacing={3} sx={{ maxWidth: "6000px" }}>
                    {images.map((imagen, index) => (
                      <Grid item xs={10} sm={6} md={4} key={index}>
                        <Box
                          sx={{
                            padding: "4px",
                            borderRadius: "5px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            backgroundColor: "#5C7373",
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              sx={{ color: "white", fontSize: "12px" }}
                            >
                              {imagen.image_name}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Descripcion:
              </Typography>

              <Box
                sx={{
                  height: "70px",
                }}
              >
                <Typography sx={{ mb: 1, fontStyle: "italic" }}>
                  {imageFile ? imageFile.description : "No hay descripcion"}

                  {/* {imageFile.description} */}
                </Typography>
              </Box>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Age</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>Ingles</MenuItem>
                    <MenuItem value={2}>Frances</MenuItem>
                    <MenuItem value={3}>Aleman</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  height: "70px",
                  padding: "10px",
                }}
              >
                <Typography sx={{ mb: 1, fontStyle: "italic" }}>
                  {currentLang}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Images;
