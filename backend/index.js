import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import {DB} from './config/db.js'
import router from './routers/routers.js';
import ErrorHandlingMiddleware from './middleware.js/ErrorHandlingMiddleware.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const app = express();
const PORT=process.env.PORT || 5000
// Получаем текущий путь к файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const url=process.env.DB_URL
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' 
}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', router)
app.use(ErrorHandlingMiddleware)
app.get('/',(req,res)=>{
    res.status(200).json({message:"working"})
})

const start = async ()=>{
    try{
await DB.authenticate()
    console.log('Connection to DB established');
  

   
await DB.sync()
app.listen(PORT, console.log(`сервер запущен на ${PORT}`))
    } catch(e){
console.log(e)
    }
}

start()
