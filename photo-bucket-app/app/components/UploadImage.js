"use client";

import { useEffect, useState } from 'react';
import {
    TextField, Button, Select, MenuItem, InputLabel, FormControl, Container, Box, Typography, Card, CardMedia
} from '@mui/material';
import Cookies from 'js-cookie';

const UploadImage = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imageName, setImageName] = useState('');
    const [imageDescription, setImageDescription] = useState('');
    const [albums, setAlbums] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState('');

    const userCookie = Cookies.get('user');
    let user = {
      id: -1
    };
    
    if (userCookie) {
      try {
        user = JSON.parse(userCookie);
      } catch (error) {
        console.error("Error al parsear la cookie 'user':", error);
      }
    } else {
      console.warn("No se encontró la cookie 'user'");
    }

    useEffect(() => {
        const fetchAlbums = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userCookie.id_user}/albums`);
            const data = await response.json();
            if (data.status) {
                setAlbums(data.albums);
            } else {
                console.error('Error fetching albums:', data.message);
            }
        };

        fetchAlbums();
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
        } else {
            alert('Por favor selecciona una imagen válida');
        }
    };

    const handleUpload = async () => {
        if (!imageFile || !imageName || !imageDescription || !selectedAlbumId) {
            alert('Por favor completa todos los campos.');
            return;
        }

        const formData = new FormData();
        formData.append('image_name', imageName);
        formData.append('description', imageDescription);
        formData.append('id_album', selectedAlbumId);
        formData.append('image', imageFile);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/image/create`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.status) {
                alert('Imagen cargada con éxito');
            } else {
                alert('Error al cargar la imagen: ' + data.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Ocurrió un error al intentar cargar la imagen. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <Container
            component="main"
            maxWidth="100vh"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: '5px',
                backgroundColor: '#011F26',
            }}
        >
            <Typography variant="h4" sx={{ color: 'white', marginBottom: '20px' }}>
                Subir Imagen
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 2,
                    marginBottom: '20px',
                }}
            >
                {/* Área para seleccionar la imagen */}
                <Card sx={{ width: '50%', backgroundColor: '#5C7373', padding: '10px' }}>
                    <Typography variant="h6" align="center" gutterBottom sx={{ color: 'white' }}>
                        Imagen a subir
                    </Typography>
                    <CardMedia
                        component="div"
                        sx={{
                            border: '1px solid white',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#333',
                            marginBottom: '10px',
                        }}
                    >
                        {imageFile ? (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Selected"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        ) : (
                            <Typography sx={{ color: 'white' }}>No hay imagen seleccionada</Typography>
                        )}
                    </CardMedia>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            backgroundColor: '#027368',
                            color: 'white',
                            width: '100%',
                            '&:hover': { backgroundColor: '#027368cc' },
                        }}
                    >
                        Seleccionar imagen
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </Button>
                </Card>

                {/* Área de detalles */}
                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nombre de la imagen"
                        variant="outlined"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        sx={{
                            backgroundColor: '#5C7373',
                            color: 'white',
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white', color: 'white' },
                                '&:hover fieldset': { borderColor: 'white', color: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white', color: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
                        }}
                    />

                    <TextField
                        label="Descripción de la imagen"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        sx={{
                            backgroundColor: '#5C7373',
                            color: 'white',
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white', color: 'white' },
                                '&:hover fieldset': { borderColor: 'white', color: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white', color: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
                        }}
                    />

                    <FormControl fullWidth>
                        <InputLabel sx={{ color: 'white' }}>Seleccione el álbum destino</InputLabel>
                        <Select
                            value={selectedAlbumId}
                            onChange={(e) => setSelectedAlbumId(e.target.value)}
                            sx={{
                                backgroundColor: '#5C7373',
                                borderColor: 'white',
                                color: 'white',
                                borderRadius: '4px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white', color: 'white' },
                                    '&:hover fieldset': { borderColor: 'white', color: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: 'white', color: 'white' },
                                },
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiSelect-icon': { color: 'white' },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#5C7373',
                                        '& .MuiMenuItem-root': {
                                            color: '#fff',
                                            '&.Mui-selected': {
                                                bgcolor: '#027368',
                                                color: '#fff',
                                            },
                                            '&.Mui-selected:hover': { bgcolor: '#027368' },
                                            '&:hover': { bgcolor: '#027368' },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="">
                                <em>Seleccione un álbum</em>
                            </MenuItem>
                            {albums.map((album) => (
                                <MenuItem key={album.id_album} value={album.id_album}>
                                    {album.album_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Button
                variant="contained"
                onClick={handleUpload}
                sx={{
                    backgroundColor: '#027368',
                    color: 'white',
                    marginTop: '10px',
                    '&:hover': { backgroundColor: '#027368cc' },
                }}
            >
                Cargar Imagen
            </Button>
        </Container>
    );
};

export default UploadImage;
