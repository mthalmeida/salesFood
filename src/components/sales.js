import { Card, CardMedia, Grid, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function Sales() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [saleDetails, setSaleDetails] = useState({
        quantity: 0,
        buyer: '',
        paid: false,
        paymentMethod: ''
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const handleCardClick = (product) => {
        setSelectedProduct(product);
        setSaleDetails({
            quantity: 0,
            buyer: '',
            paid: false,
            paymentMethod: ''
        });
        setOpen(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSaleDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleCheckboxChange = (event) => {
        setSaleDetails(prevDetails => ({
            ...prevDetails,
            paid: event.target.checked
        }));
    };

    const handleSave = () => {
        if (
            selectedProduct &&
            saleDetails.quantity > 0 &&
            saleDetails.quantity <= selectedProduct.quantity &&
            saleDetails.buyer.trim() !== '' &&
            (!saleDetails.paid || (saleDetails.paid && saleDetails.paymentMethod !== ''))
        ) {
            const sale = {
                product: selectedProduct,
                details: saleDetails
            };
            const updatedProduct = {
                ...selectedProduct,
                quantity: selectedProduct.quantity - saleDetails.quantity
            };
            const updatedCart = cart.map(item => (item.id === selectedProduct.id ? updatedProduct : item));
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            const sales = JSON.parse(localStorage.getItem('sales')) || [];
            sales.push(sale);
            localStorage.setItem('sales', JSON.stringify(sales));
            setOpen(false);
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleQuantityIncrement = () => {
        setSaleDetails(prevDetails => ({
            ...prevDetails,
            quantity: prevDetails.quantity + 1
        }));
    };

    const handleQuantityDecrement = () => {
        if (saleDetails.quantity > 0) {
            setSaleDetails(prevDetails => ({
                ...prevDetails,
                quantity: prevDetails.quantity - 1
            }));
        }
    };

    const sendSalesToWhatsApp = () => {
        setConfirmOpen(true);
    };

    const handleConfirmSend = () => {
        const cdgSend = localStorage.getItem('cdgSend');
        if (!cdgSend) {
            alert('Código de envio não configurado.');
            return;
        }
        if (password === cdgSend) {
            const sales = JSON.parse(localStorage.getItem('sales')) || [];
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const dateString = `${day}/${month}/${year}`;
            let message = `Vendas realizadas no dia ${dateString}:\n`;
            sales.forEach((sale, index) => {
                message += `${index + 1}. Produto: ${sale.product.title}, Quantidade: ${sale.details.quantity}, Comprador: ${sale.details.buyer}\n`;
            });
            const whatsappNumber = localStorage.getItem('wpp');
            if (!whatsappNumber) {
                alert('Número de WhatsApp não configurado. Configure na tela inicial.');
                return;
            }
            const encodedMessage = encodeURIComponent(message);
            const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
            window.open(whatsappLink, '_blank');
            setConfirmOpen(false);
        } else {
            alert('Senha incorreta. Tente novamente.');
        }
    };

    return (
        <Box
            className="Sales"
            sx={{
                backgroundColor: '#EDE7F6',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Box sx={{ position: 'fixed', top: 0, width: '100%', backgroundColor: '#1f5f61', zIndex: 1, padding: 2 }}>
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
                    Registrar Venda
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2, paddingTop: '50px', paddingBottom: '70px', marginTop: '60px' }}>
                <Grid container justifyContent="center" spacing={3}>
                    {cart.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4} sx={{ marginBottom: '20px' }}>
                            <Card sx={{ display: 'flex', borderRadius: '10px', boxShadow: '2px 3px 5px #00000030' }} onClick={() => handleCardClick(product)}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 150, height: 150 }}
                                    image={product.image}
                                    alt={product.title}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                                    <Typography variant="h6" component="div" style={{ fontFamily: 'revert' }}>
                                        {product.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Disponível: {product.quantity}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Button
                variant="text"
                onClick={handleBack}
                sx={{
                    fontSize: '50px',
                    borderRadius: '50%',
                    position: 'fixed',
                    top: '10px',
                    right: '20px',
                    width: '30px',
                    height: '65px',
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Typography variant="b2" color="white">
                    ↩󠁽
                </Typography>
            </Button>
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Finalizar vendas</DialogTitle>
                <DialogContent>
                    <TextField
                        size="small"
                        label="Senha"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: '20px' }}
                    />
                    <Typography variant="body1" color="textSecondary">
                        Digite a senha para confirmar
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="secondary">Cancelar</Button>
                    <Button onClick={handleConfirmSend} color="primary">Finalizar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Detalhes da Venda</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        label="Comprador"
                        name="buyer"
                        variant="outlined"
                        value={saleDetails.buyer}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: '20px' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                        <Button
                            variant='contained'
                            onClick={handleQuantityDecrement}
                            color="error"
                            sx={{
                                borderRadius: '50%',
                                minWidth: 'unset',
                                width: '48px',
                                height: '48px',
                                marginRight: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                fontFamily: 'Arial Black',
                                textTransform: 'none'
                            }}
                        >
                            -
                        </Button>
                        {selectedProduct && (
                            <>
                                <Typography variant="h6" component="div" sx={{ minWidth: '48px', textAlign: 'center', fontFamily: 'Arial Black' }}>
                                    {saleDetails.quantity}
                                </Typography>
                                <Button
                                    variant='contained'
                                    onClick={handleQuantityIncrement}
                                    color="success"
                                    disabled={saleDetails.quantity >= selectedProduct.quantity}
                                    sx={{
                                        borderRadius: '50%',
                                        minWidth: 'unset',
                                        width: '48px',
                                        height: '48px',
                                        marginLeft: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px',
                                        fontFamily: 'Arial Black',
                                        textTransform: 'none'
                                    }}
                                >
                                    +
                                </Button>
                            </>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={saleDetails.paid}
                                    onChange={handleCheckboxChange}
                                    name="paid"
                                />
                            }
                            label={<Typography>Pagamento Realizado</Typography>}
                        />
                    </Box>
                    <TextField
                        select
                        label="Forma de Pagamento"
                        name="paymentMethod"
                        variant="outlined"
                        value={saleDetails.paymentMethod}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: '20px' }}
                        disabled={!saleDetails.paid}
                        required={saleDetails.paid}
                    >
                        <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                        <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
                        <MenuItem value="Cartão de Débito">Cartão de Débito</MenuItem>
                        <MenuItem value="PIX">PIX</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">Cancelar</Button>
                    <Button onClick={handleSave} color="primary">Salvar</Button>
                </DialogActions>
            </Dialog>
            <Button
                variant="contained"
                color="warning"
                onClick={sendSalesToWhatsApp}
                sx={{ width: '80%', position: 'fixed', bottom: 20, left: "10%" }}
            >
                <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
                    Finalizar vendas
                </Typography>
            </Button>
        </Box >
    );
}

export default Sales;
