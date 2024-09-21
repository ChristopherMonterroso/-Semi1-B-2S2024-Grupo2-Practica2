"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { GetAlbums } from "../services/Albums";

const Albumnes = ({ id_user }) => {
  const [imageFile, setImageFile] = useState(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    getAlbums();
  }, []);

  const getAlbums = async () => {
    try {
      const result = await GetAlbums(id_user);
      if (result.status) {
        setAlbums(result.albums);
      } else {
        console.error("No se encontraron albums");
        return;
      }
    } catch (error) {
      console.error("Error al obtener albums", error);
    }
  };

  const handleClick = (carpeta) => {
    alert(`Carpeta seleccionada: ${carpeta.id_album}`);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Por favor selecciona una imagen válida");
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
          Albumnes
        </Typography>
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
          {albums.map((carpeta, index) => (
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
                onClick={() => handleClick(carpeta)}
              >
                <img
                  src='carpeta.png' // La URL de la imagen de la carpeta
                  alt={carpeta.album_name} // Descripción de la imagen
                  style={{
                    width: "80px", // Asegura que la imagen ocupe todo el ancho del Box
                    height: "80px", // Mantiene la proporción
                  }}
                />
                 <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ color: "white" }}>
                  {carpeta.album_name}
                </Typography>
              </Box>
              </Box>
             
            </Grid>
          ))}
        </Grid>
      </Box>

    </Container>
  );
};

export default Albumnes;
