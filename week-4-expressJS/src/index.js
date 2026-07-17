const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

// Read the JSON file
const data = fs.readFileSync('./data/storage.json', 'utf8');
const products = JSON.parse(data);

app.get('/storageData', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'all stored data',
    data: products
  });
});

app.get('/storageData/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    console.log(productId);
    const product = products.find(pro => pro.id === productId);
    if (!product){
        return res.status(404).json({
            status: 'fail',
            message: 'Product not found'
        });
    }
    res.status(200).json({
        status: 'success',
        data: product
    });
});

app.post('/storageData', (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    products.push(newProduct);
    fs.writeFileSync('./data/storage.json', JSON.stringify(products), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to save product'
            });
        }
    });
    res.status(201).json({
        status: 'success',
        message: 'Product added successfully',
        data: newProduct,
        allProducts: products        
    });
});

app.listen(3000, ( ) => {
    console.log('Server is running on port 3000');
})