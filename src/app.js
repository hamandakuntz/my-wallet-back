import express from "express";
import cors from "cors";
import pg from "pg";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import { v4 as uuidv4 } from 'uuid';
import connection from "./database.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {

    const registerSchema = Joi.object({
        name: Joi.string().min(1).max(30).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(3).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    });

    const validation = registerSchema.validate(req.body);

    if (!validation.error) {   
        
        try {
        
            const { name, email, password } = req.body;            
            const checkExistingEmail = await connection.query(`
            SELECT * FROM users
            WHERE email = $1
            `, [email]);

            if(checkExistingEmail.rows.length > 0) {
                return res.sendStatus(403);
            }

            const hash = bcrypt.hashSync(password, 12);

            await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3)
            `, [name, email, hash]);
            
            res.sendStatus(201);

        } catch (e) {           
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(400);
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
        const token = uuidv4();
        
        await connection.query(`
          INSERT INTO sessions ("userId", token)
          VALUES ($1, $2)
        `, [user.id, token]);

        res.send(token);
    } else {
        res.sendStatus(401);
    }     
});

app.get("/transactions", async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace('Bearer ', '');               
       
        const user = await connection.query(`
        SELECT * FROM sessions
        JOIN users
        ON sessions."userId" = users.id
        WHERE sessions.token = $1
        `, [token]);

        if(!token) return res.sendStatus(401);     
            
   
        if(user.rows[0]) {
            const result = await connection.query(`
            SELECT * FROM transactions 
            WHERE "idUser" = $1
            ORDER BY date DESC
            `, [user.rows[0].userId])

            res.send({
                transactions: result.rows,
                userName: user.rows[0].name                
            });
            
        } else {
            res.sendStatus(401);
        }

    } catch(e) {       
        res.sendStatus(500);
    }
});

app.post("/newtransaction", async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace('Bearer ', '');               
       
        const user = await connection.query(`
        SELECT * FROM sessions
        JOIN users
        ON sessions."userId" = users.id
        WHERE sessions.token = $1
        `, [token]);

        if(!token) return res.sendStatus(401); 
        

        const { value, description, type } = req.body;  
        const date = dayjs().format('YYYY-MM-DD HH:mm:ss'); 

        const acceptedTypes = ['entry', 'output'];
        
        const transactionSchema = Joi.object({
            value: Joi.required(),
            description: Joi.string().required(),
            type: Joi.string().valid(...acceptedTypes).required()
        });
    
        const validation = transactionSchema.validate(req.body);

        if (!validation.error) {   
        
            if(user.rows[0]) {
                const result = await connection.query(`
                INSERT INTO transactions ("idUser", date, description, value, type)
                VALUES ($1, $2, $3, $4, $5)
                `, [user.rows[0].userId, date, description, value, type])

                res.sendStatus(201);

            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(400);
        }

    } catch(e) {       
        res.sendStatus(500);
    }
});

app.post("/logout", async (req, res) => {
    try {
        const authorization = req.headers['authorization'];
        const token = authorization?.replace('Bearer ', '');               
       
        if(!token) return res.sendStatus(401); 

        await connection.query(`
        DELETE FROM sessions
        WHERE token = $1
        `, [token]); 
        
        res.sendStatus(200);

    } catch(e) {       
        res.sendStatus(500);
    } 
});

export default app;