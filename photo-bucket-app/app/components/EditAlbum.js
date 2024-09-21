"use client";

import { useEffect, useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Container, Box, Typography } from '@mui/material';
import Cookies from 'js-cookie';

const EditAlbum = () => {
    const [albumName, setAlbumName] = useState('');
    const [albums, setAlbums] = useState([]);
    const [selectedAlbumToDelete, setSelectedAlbumToDelete] = useState('');
    const [selectedAlbumToRename, setSelectedAlbumToRename] = useState('');
    const [newAlbumName, setNewAlbumName] = useState('');

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

    const fetchAlbums = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.user.id_user}/albums`);
        const data = await response.json();
        if (data.status) {
            setAlbums(data.albums);
        } else {
            console.error('Error fetching albums:', data.message);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const handleCreateAlbum = async () => {
        if (!albumName) {
            alert('Por favor ingresa un nombre para el álbum.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ album_name: albumName, id_user: user.user.id_user }),
            });

            const data = await response.json();
            if (data.status) {
                alert('Álbum creado con éxito');
                setAlbumName('');
                fetchAlbums(); // Actualiza la lista de álbumes
            } else {
                alert('Error al crear el álbum: ' + data.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Ocurrió un error al intentar crear el álbum. Por favor, inténtalo de nuevo.');
        }
    };

    const handleDeleteAlbum = async () => {
        if (!selectedAlbumToDelete) {
            alert('Por favor selecciona un álbum para eliminar.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/delete/${selectedAlbumToDelete}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.status) {
                alert('Álbum eliminado con éxito');
                fetchAlbums(); // Actualiza la lista de álbumes
            } else {
                alert('Error al eliminar el álbum: ' + data.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Ocurrió un error al intentar eliminar el álbum. Por favor, inténtalo de nuevo.');
        }
    };

    const handleRenameAlbum = async () => {
        if (!selectedAlbumToRename || !newAlbumName) {
            alert('Por favor selecciona un álbum y proporciona un nuevo nombre.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/update/${selectedAlbumToRename}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ album_name: newAlbumName }),
            });

            const data = await response.json();
            if (data.status) {
                alert('Álbum renombrado con éxito');
                setNewAlbumName('');
                fetchAlbums(); // Actualiza la lista de álbumes
            } else {
                alert('Error al renombrar el álbum: ' + data.message);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Ocurrió un error al intentar renombrar el álbum. Por favor, inténtalo de nuevo.');
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
            }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginBottom: '20px', mb: 2 }}>
                <Typography variant="h4" sx={{ color: 'white' }}>Editar Álbumes</Typography>
            </Box>

            {/* Crear Álbum */}
            <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
                <TextField
                    label="Nombre del álbum"
                    variant="outlined"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    sx={{
                        backgroundColor: '#5C7373',
                        color: 'white',
                        borderRadius: '4px',
                        flex: 1, // Hace que el TextField ocupe el espacio disponible
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                                color: 'white'
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                                color: 'white'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                                color: 'white'
                            },
                        },
                        '& .MuiInputLabel-root': {
                            borderColor: 'white',
                            color: 'white'
                        },
                        '& .MuiInputBase-input': {
                            borderColor: 'white',
                            color: 'white'
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleCreateAlbum}
                    sx={{
                        backgroundColor: '#027368',
                        color: 'white',
                        minWidth: '140px',
                        '&:hover': {
                            backgroundColor: '#027368cc', // 20% más oscuro
                        },
                    }}
                >
                    Crear Álbum
                </Button>
            </Box>

            {/* Eliminar Álbum */}
            <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
                <FormControl fullWidth >
                    <InputLabel sx={{ color: 'white' }}>Seleccione el álbum a eliminar</InputLabel>
                    <Select
                        value={selectedAlbumToDelete}
                        onChange={(e) => setSelectedAlbumToDelete(e.target.value)}
                        sx={{
                            backgroundColor: '#5C7373',
                            borderColor: 'white',
                            color: 'white',
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                    color: 'white'
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                    color: 'white'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                    color: 'white'
                                },
                            },
                            '& .MuiInputLabel-root': {
                                borderColor: 'white',
                                color: 'white'
                            },
                            '& .MuiSelect-icon': {
                                borderColor: 'white',
                                color: 'white'
                            },
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
                                        '&.Mui-selected:hover': {
                                            bgcolor: '#027368',
                                        },
                                        '&:hover': {
                                            bgcolor: '#027368',
                                        }
                                    }
                                }
                            }
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
                <Button
                    onClick={handleDeleteAlbum}
                    sx={{
                        backgroundColor: '#027368',
                        color: 'white',
                        minWidth: '140px',
                        '&:hover': {
                            backgroundColor: '#027368cc',
                        },
                    }}
                >
                    Eliminar
                </Button>
            </Box>

            {/* Renombrar Álbum */}
            <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel
                        sx={{ color: 'white' }}
                    >Seleccione el álbum a modificar</InputLabel>
                    <Select
                        value={selectedAlbumToRename}
                        onChange={(e) => setSelectedAlbumToRename(e.target.value)}
                        sx={{
                            backgroundColor: '#5C7373',
                            borderColor: 'white',
                            color: 'white',
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                    color: 'white'
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white',
                                    color: 'white'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white',
                                    color: 'white'
                                },
                            },
                            '& .MuiInputLabel-root': {
                                borderColor: 'white',
                                color: 'white'
                            },
                            '& .MuiSelect-icon': {
                                borderColor: 'white',
                                color: 'white'
                            },
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
                                        '&.Mui-selected:hover': {
                                            bgcolor: '#027368',
                                        },
                                        '&:hover': {
                                            bgcolor: '#027368',
                                        }
                                    }
                                }
                            }
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
                <TextField
                    label="Nuevo nombre del álbum"
                    variant="outlined"
                    fullWidth
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    sx={{
                        backgroundColor: '#5C7373',
                        borderColor: 'white',
                        color: 'white',
                        borderRadius: '4px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                                color: 'white'
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                                color: 'white'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                                color: 'white'
                            },
                        },
                        '& .MuiInputLabel-root': {
                            borderColor: 'white',
                            color: 'white'
                        },
                        '& .MuiInputBase-input': {
                            borderColor: 'white',
                            color: 'white'
                        },
                    }}
                />
                <Button

                    onClick={handleRenameAlbum}
                    sx={{
                        backgroundColor: '#027368',
                        color: 'white',
                        minWidth: '140px',
                        '&:hover': {
                            backgroundColor: '#027368cc',
                        },
                    }}
                >
                    Renombrar
                </Button>
            </Box>
        </Container>
    );
};

export default EditAlbum;
