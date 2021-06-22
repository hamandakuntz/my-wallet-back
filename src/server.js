import express from "express";
import cors from "cors";
import pg from "pg";
import Joi from "joi";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

const { Pool } = pg;

const connection = new Pool({
    "host": "localhost",
    "port": 5432,
    "database": "mywallet",
    "user": "postgres",
    "password": "123456"
});

const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
    try {
    
        const { name, email, password } = req.body;
        
        const checkExistingEmail = await connection.query(`
        SELECT * FROM users
        WHERE email = $1
        `, [email]);

        if(checkExistingEmail.rows.length > 0) {
            return res.sendStatus(409);
        }

        const hash = bcrypt.hashSync(password, 12);

        await connection.query(`
        INSERT INTO users
        (name, email, password)
        VALUES ($1, $2, $3)
        `, [name, email, hash]);
        
        res.sendStatus(201);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const result = await connection.query(`
    SELECT * FROM users 
    WHERE email = $1
    `, [email]);
    
    const user = result.rows[0];

    if(user && bcrypt.compareSync(password, user.password)) {     
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }     
});

app.listen(4000, () => {console.log("Server rodando na 4000")});
