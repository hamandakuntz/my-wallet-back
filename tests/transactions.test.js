import "../src/setup.js"
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

describe("GET /transactions", () => {

    it("returns the correct transaction data object", async () => {
                
        const response = await connection.query(`
        INSERT INTO users (name, email, password)
        VALUES ('teste', 'teste@teste.com', 'testeencriptado') RETURNING id     
        `);

        const userId = response.rows[0].id;

        const randomNumber = parseInt(Math.random()*1000);

        await connection.query(`
            INSERT INTO sessions ("userId", token)
            VALUES (${userId}, 'meusupertoken${randomNumber}')
        `);
                    
        const getTransactionId = await connection.query(`
        INSERT INTO transactions ("idUser", date, description, value, type)
        VALUES (${userId}, '2021-06-28', 'testeee', 3000, 'entry') RETURNING id
        `);               
        
        const result = (await supertest(app).get("/transactions").set('Authorization', `meusupertoken${randomNumber}`));          
        const obj = { transactions: [{ id: getTransactionId.rows[0].id, idUser: userId, date: '2021-06-28T03:00:00.000Z', description: "testeee", value: 3000, type:"entry" }], userName: 'teste' } 
        expect(JSON.parse(result.text)).toEqual(obj);
    });

    it("returns 200 for authenticated user", async () => {
        const response = await connection.query(`
        INSERT INTO users (name, email, password)
        VALUES ('teste', 'teste@teste.com', 'testeencriptado') RETURNING id     
        `);

        const userId = response.rows[0].id;

        const randomNumber = parseInt(Math.random()*1000);

        await connection.query(`
            INSERT INTO sessions ("userId", token)
            VALUES (${userId}, 'meusupertoken${randomNumber}')
        `);                  
                     
        const result = (await supertest(app).get("/transactions").set('Authorization',`meusupertoken${randomNumber}`));          
        expect(result.status).toEqual(200);
    });

    it("returns 401 for a non-authenticated user", async () => {
        const result = (await supertest(app).get("/transactions").set('Authorization',''));          
        expect(result.status).toEqual(401);
    });  
}); 

describe("POST /newtransaction", () => {
    it("returns the correct transaction data object", async () => {

        const response = await connection.query(`
        INSERT INTO users (name, email, password)
        VALUES ('teste', 'teste@teste.com', 'testeencriptado') RETURNING id     
        `);

        const userId = response.rows[0].id;

        const randomNumber = parseInt(Math.random()*1000);

        await connection.query(`
            INSERT INTO sessions ("userId", token)
            VALUES (${userId}, 'meusupertoken${randomNumber}')
        `);

        const getToken = await connection.query(`
        SELECT sessions.token FROM sessions
        JOIN users
        ON sessions."userId" = users.id
        WHERE users.email = 'teste@teste.com'
        `)  
        
        const body = { value: '4000', description: 'lala', type: 'entry' }

        const result = await supertest(app).post("/newtransaction").set('Authorization', `${getToken.rows[0].token}`).send(body);                
        expect(result.status).toEqual(201);
    });

    it("returns 200 for authenticated user", async () => {

        const response = await connection.query(`
        INSERT INTO users (name, email, password)
        VALUES ('teste', 'teste@teste.com', 'testeencriptado') RETURNING id     
        `);

        const userId = response.rows[0].id;

        const randomNumber = parseInt(Math.random()*1000);

        await connection.query(`
            INSERT INTO sessions ("userId", token)
            VALUES (${userId}, 'meusupertoken${randomNumber}')
        `);

        const getToken = await connection.query(`
        SELECT sessions.token FROM sessions
        JOIN users
        ON sessions."userId" = users.id
        WHERE users.email = 'teste@teste.com'
        `)   

        const body = { 
        value: '4000', 
        description: 'lala', 
        type: 'entry' }

        const result = await supertest(app).post("/newtransaction").set('Authorization',`${getToken.rows[0].token}`).send(body);          
        expect(result.status).toEqual(201);
    });

    it("returns 401 for a non-authenticated user", async () => {
        
        const body = { value: '4000', description: 'lala', type: 'entry' }

        const result = await supertest(app).post("/newtransaction").set('Authorization','').send(body);          
        expect(result.status).toEqual(401);
    });  
}); 

afterAll( async () => {
    await connection.query(`
        DELETE FROM transactions
    `)  

    await connection.query(`
        DELETE FROM sessions
    `)  

    await connection.query(`
        DELETE FROM users
    `)  

    connection.end();
});

beforeEach( async () => {
    await connection.query(`
        DELETE FROM transactions
    `)  

    await connection.query(`
        DELETE FROM sessions
    `)  

    await connection.query(`
        DELETE FROM users
    `)   
});