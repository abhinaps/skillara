import express from 'express'; 

const app = express(); 

app.get('/', (req, res) => res.send('Hello Skillara!')); 

app.listen(4000);
