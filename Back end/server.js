const express = require('express');
const db = require('./models/index'); 
const taskRoutes = require('./routes/tasks');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 4000;
var bodyParser = require('body-parser');

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/tasks', taskRoutes);

db.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
