import pool from "./pool.js"

const getClient = async () => {
    const client = await pool.connect();
    
    const query = client.query;
    const release = client.release;

    const setTimeout = (() => {
        console.info('Client sudah dipinjam lebih dari 5 second');
        console.info(`Last query : ${client.lastQuery}`);
    }, 5000);

    client.query = (...args) => {
        client.lastQuery = args;
        return query.apply(client, args);
    }

    client.release = () => {
        clearTimeout(setTimeout);
        client.query = query;
        client.release = release;
        return release.apply(client);
    }

    return client;
}

export default {
    getClient
}