//conexão com o postgres
var pg = require('pg');
var _db;

exports.connect = (error) => {      
        const client = new pg.Client({
            user: 'postgres',
            host: '172.17.0.1',
            database: 'iag_tecnica',
            password: 'root',
            port: 5432,
        });
        client.connect()
            .then(() => {
                console.log('connected');
            })
            .catch(err => {
                console.error('connection error', err.stack);
                error(err.stack);
                return;
            });

        client.on('end', () => {
            console.log('connection end');
        });  
        return client;
    }
