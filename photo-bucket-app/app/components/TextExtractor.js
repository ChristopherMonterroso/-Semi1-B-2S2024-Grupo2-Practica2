"use client";

import { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';

const TextExtractor = () => {
    const [imageFile, setImageFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
        } else {
            alert('Por favor selecciona una imagen válida');
        }
    };

    const handleExtractText = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/extract-text`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.status) {
            setExtractedText(data.text.join('\n'));
        } else {
            console.error('Error extracting text:', data.message);
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: 'white' }}>Extractor de Texto</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            backgroundColor: '#5C7373',
                            border: '1px solid #ccc',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}
                    >
                        {imageFile ? (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Selected"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        ) : (
                            'No hay imagen seleccionada'
                        )}
                    </Box>
                    <Button
                        component="label"
                        sx={{
                            backgroundColor: '#027368',
                            color: 'white',
                            mt: 2,
                            '&:hover': {
                                backgroundColor: '#027368cc',
                            },
                        }}
                    >
                        Seleccionar Imagen
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </Button>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Texto extraído:</Typography>
                    <TextField
                        value={extractedText}
                        multiline
                        readOnly
                        rows={4}
                        fullWidth
                        sx={{
                            backgroundColor: '#5C7373',
                            color: 'white',
                            '& .MuiInputBase-root': {
                                color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleExtractText}
                        sx={{
                            backgroundColor: '#027368',
                            color: 'white',
                            mt: 2,
                            '&:hover': {
                                backgroundColor: '#027368cc',
                            },
                        }}
                    >
                        Extraer texto
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default TextExtractor;
