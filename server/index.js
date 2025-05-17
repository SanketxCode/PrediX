const express = require('express');
const cors = require('cors');

const app  =  express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Predix backend is running........');
});

const PORT = 4000;

app.listen(PORT,()=>{
  console.log(`Server is running on PORT:${PORT}`);
})