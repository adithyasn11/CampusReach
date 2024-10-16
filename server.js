import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
