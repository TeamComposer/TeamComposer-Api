// index.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');
const teamRoutes = require('./src/routes/teamRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/TeamComposer';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao banco de dados MongoDB');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

app.use(express.json());

app.use('/users', userRoutes);
app.use('/teams', teamRoutes);

app.get('/', (req, res) => {
  res.send('API TeamComposer!');
}); 
  
app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
});
