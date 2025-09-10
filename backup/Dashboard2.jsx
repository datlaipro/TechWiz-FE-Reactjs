import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Dashboard2 = () => {

  const [products, setProducts] = useState([]);
  const [ten_sp, setTenSp] = useState('');
  const [gia_tien, setGiaTien] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:3000/phpm/read.php');
    setProducts(response.data);
  };

  const handleCreate = async () => {
    try { const response = await axios.post('http://localhost:3000/phpm/create.php', { ten_sp, gia_tien }); console.log(response.data); setTenSp(''); setGiaTien(''); fetchProducts(); } catch (error) { console.error('Error creating product:', error.response ? error.response.data : error.message); } };


  const handleUpdate = async () => {
    try {
    await axios.post('http://localhost:3000/phpm/update.php', { id: selectedProduct.id, ten_sp, gia_tien });
    setSelectedProduct(null);
    setTenSp('');
    setGiaTien('');
    fetchProducts();
  } catch (error) { console.error('Error updating product:', error); } };

  const handleDelete = async (id) => {
    await axios.post('http://localhost:3000/phpm/delete.php', { id });
    fetchProducts();
  };


  return (
    <>
         <Container>
      <Typography variant="h4" component="h1" gutterBottom>CRUD với PHP REACT MYSQL</Typography>

      <TextField label="Tên Sản Phẩm" value={ten_sp} onChange={(e) => setTenSp(e.target.value)} margin="normal" />
      <TextField label="Giá Tiền" value={gia_tien} onChange={(e) => setGiaTien(e.target.value)} margin="normal" />

      {selectedProduct ? (
        <Button onClick={handleUpdate} variant="contained" color="primary">Update Product</Button>
      ) : (
        <Button onClick={handleCreate} variant="contained" color="primary">Add Product</Button>
      )}

      <List>
        {products.map(product => (
          <ListItem key={product.id} divider>
            <ListItemText primary={`${product.ten_sp}  Giá tiền: ${product.gia_tien}`} />
            <IconButton onClick={() => { setSelectedProduct(product); setTenSp(product.ten_sp);  setGiaTien(product.gia_tien); }}><EditIcon /></IconButton>
            <IconButton onClick={() => handleDelete(product.id)}><DeleteIcon /></IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
    </>
  );
};

export default Dashboard2;