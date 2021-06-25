import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
    "host": "localhost",
    "port": 5432,
    "database": "mywallet",
    "user": "postgres",
    "password": "123456"
});

export default connection;