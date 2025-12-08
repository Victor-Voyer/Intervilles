import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();


const PORT = process.env.PORT;

if(!PORT){
    console.log('PORT absent veuillez completer le fichier .env');
    process.exit(1);
}

app.listen(PORT, ()=>{
    console.log(`Serveur lancé sur le port ${PORT}`);
});