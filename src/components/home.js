import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography, TextField, Button, Modal, Box } from '@mui/material';
import products from '../dados/products.json';

function Home() {
    const navigate = useNavigate();
    const [disponivel, setDisponivel] = useState(products);
    const [openModal, setOpenModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cdgSend, setCdgSend] = useState('');

    const handleQuantityChange = (productId, event) => {
        const updatedDisponivel = disponivel.map(item =>
            item.id === productId ? { ...item, quantity: parseInt(event.target.value) } : item
        );
        setDisponivel(updatedDisponivel);
    };

    const handleStartSales = () => {
        const produtosComQuantidade = disponivel.filter(item => item.quantity > 0);
        localStorage.setItem('cart', JSON.stringify(produtosComQuantidade));
        navigate('/sales');
    };

    const handleSavePhoneNumber = () => {
        localStorage.setItem('wpp', phoneNumber);
        localStorage.setItem('cdgSend', cdgSend);
        setOpenModal(false);
    };

    const handleClearSales = () => {
        localStorage.removeItem('sales');
        localStorage.removeItem('cart');
        setOpenModal(false);
    };

    useEffect(() => {
        setDisponivel(products);
    }, []);

    return (
        <Box
            className="Home"
            sx={{
                backgroundColor: '#EDE7F6',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    backgroundColor: '#1f5f61',
                    zIndex: 1,
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    style={{
                        fontFamily: 'Pacifico, Arial',
                        color: 'white'
                    }}
                    sx={{
                        marginBottom: 1,
                        paddingTop: 2,
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}
                >
                    Qual a venda de hoje?
                </Typography>
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => setOpenModal(true)}
                    sx={{
                        borderRadius: '50%',
                        height: '60px',
                        marginRight: '30px',
                        ml: 2,
                        alignSelf: 'flex-start',
                    }}
                >
                    <Typography
                        style={{
                            fontFamily: 'Pacifico, Arial',
                        }}
                        sx={{
                            marginBottom: 1,
                            paddingTop: 1,
                            fontSize: '20px',
                            fontWeight: 'bold',
                        }}
                    >
                        ⚙️
                    </Typography>
                </Button>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2, paddingTop: '50px', paddingBottom: '70px', marginTop: '60px' }}>
                <Grid container justifyContent="center" spacing={3}>
                    {disponivel.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4} sx={{ marginBottom: '20px' }}>
                            <Card sx={{ display: 'flex', borderRadius: '10px', boxShadow: '2px 3px 5px #00000030' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 150, height: 150 }}
                                    image={product.image}
                                    alt={product.title}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                                    <Typography variant="h8" component="div" style={{ fontFamily: 'revert' }}>
                                        {product.title}
                                    </Typography>
                                    <TextField
                                        label="Quantidade"
                                        type="number"
                                        variant="outlined"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product.id, e)}
                                        fullWidth
                                        InputProps={{ inputProps: { min: 0 } }}
                                        sx={{ marginTop: '20px' }}
                                        size="small"
                                    />
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Button
                variant="contained"
                color="success"
                onClick={handleStartSales}
                sx={{ width: '80%', position: 'fixed', bottom: 20, left: '10%' }}
            >
                Iniciar vendas
            </Button>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        minWidth: 300,
                        maxWidth: 400,
                        borderRadius: '8px',
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Configuração do aplicativo
                    </Typography>
                    <TextField
                        label="Número de telefone"
                        variant="outlined"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        label="Código de envio"
                        variant="outlined"
                        value={cdgSend}
                        onChange={(e) => setCdgSend(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClearSales}
                        >
                            Limpar vendas
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSavePhoneNumber}
                        >
                            Salvar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default Home;
