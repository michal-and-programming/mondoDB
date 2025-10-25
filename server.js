const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

client.connect()
  .then(() => {
    const db = client.db('companyDB');
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use('/api', employeesRoutes);
    app.use('/api', departmentsRoutes);
    app.use('/api', productsRoutes);

    app.use((req, res) => {
      res.status(404).send({ message: 'Not found...' });
    });

    app.listen(8000, () => {
      console.log('🚀 Server is running on port: 8000');
    });
  })