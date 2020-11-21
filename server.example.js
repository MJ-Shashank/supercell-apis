// Example for Creating a proxy server.

// Run this file in seperate folder and install all dependencies.

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Token } = require('supercell-apis');
require('dotenv').config();

const api_base = {
    'clashofclans': 'https://api.clashofclans.com/v1',
    'clashroyale': 'https://api.clashroyale.com/v1',
    'brawlstars': 'https://api.brawlstars.com/v1'
};

const tokens = [];

(async () => {
    if (process.env.COC_EMAIL && process.env.COC_PASS) {
        var token = await new Token('clashofclans', process.env.COC_EMAIL, process.env.COC_PASS).init();
        if (token) tokens.push({ name: 'clashofclans', token: token });
    }
    if (process.env.CR_EMAIL && process.env.CR_PASS) {
        var token = await new Token('clashroyale', process.env.CR_EMAIL, process.env.CR_PASS).init();
        if (token) tokens.push({ name: 'clashroyale', token: token });
    }
    if (process.env.BS_EMAIL && process.env.BS_PASS) {
        var token = await new Token('brawlstars', process.env.BS_EMAIL, process.env.BS_PASS).init();
        if (token) tokens.push({ name: 'brawlstars', token: token });
    }
})();

const app = express();

app.use(cors());

app.get('*', async (request, response) => {

    if (request && request.path && request.path.match(/\/(clashofclans|clashroyale|brawlstars)\/(.*)/)) {

        const query = request.path.match(/\/(clashofclans|clashroyale|brawlstars)\/(.*)/);

        if (tokens.find(t => t.name === query[1])) {
            try {
                const res = await axios.get(api_base[query[1]] + '/' + query[2], {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokens.find(t => t.name === query[1]).token}`
                    }
                });
                return response.status(200).send({ status: res.status, message: res.message, ...res.data });
            }
            catch (error) {
                return response.status(error.data.status).send({ status: error.data.status, message: error.data.message });
            }
        }
    }
    return response.status(404).send(`GET ${request.path} Not Found!`);
});

app.listen(process.env.PORT || 4000, () => {
    console.log('Server started...');
});