const axios = require('axios');
const { getIP } = require('./IP');

const api_base = {
    'clashofclans': 'https://api.clashofclans.com/v1',
    'clashroyale': 'https://api.clashroyale.com/v1',
    'brawlstars': 'https://api.brawlstars.com/v1'
};
const dev_base = {
    'clashofclans': 'https://developer.clashofclans.com/api',
    'clashroyale': 'https://developer.clashroyale.com/api',
    'brawlstars': 'https://developer.brawlstars.com/api'
};

const api_check = {
    'clashofclans': '/locations',
    'clashroyale': '/locations',
    'brawlstars': '/brawlers'
};

class SupercellApi {
    constructor(platform, email, password) {
        this.platform = platform.toLowerCase();
        this.email = email.toLowerCase();
        this.password = password;
    }

    async tokenGeneration(token) {
        try {
            if (this.platform === '' || this.email === '' || this.password === '') {
                throw new Error('Please enter platform/email/password.');
            }

            if (!['clashofclans', 'clashroyale', 'brawlstars'].includes(this.platform)) {
                throw new Error('Please enter a correct platform.');
            }

            // Check token if valid
            if (token && await this.checkToken(token)) {
                //console.log('Valid token!');
                return token;
            }

            let login_session = await this.loginSession();

            if (!login_session) {
                throw new Error('Incorrect email/password!');
            }

            let keys = await this.getKeys();
            if (keys && keys.length >= 10) {
                await this.revokeKey(keys.pop().id);
            }

            let ip = await getIP();

            if (keys && keys.find(k => k.name == ip)) {
                //console.log('Old token in use!');
                return keys.find(k => k.cidrRanges.includes(ip)).key;
            }
            else {
                return await this.createKey(ip);
            }
        }
        catch (error) {
            return error.message;
        }
    }

    async checkToken(token) {
        try {
            await axios.get(`${api_base[this.platform]}${api_check[this.platform]}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }

    async loginSession() {
        try {
            const response = await axios.post(`${dev_base[this.platform]}/login`, {
                email: this.email,
                password: this.password
            });
            if (response.data.status.message === 'ok') {
                let cookies = response.headers['set-cookie'];
                if (cookies && cookies[0].includes('session=')) {
                    axios.defaults.headers.post['Cookie'] = cookies[0].split(';')[0];
                    return true;
                }
            }
            return false;
        }
        catch {
            return false;
        }
    }

    async getKeys() {
        const response = await axios.post(`${dev_base[this.platform]}/apikey/list`);
        if (response.data.status.message === 'ok') {
            return response.data.keys;
        }
        return null;
    }

    async createKey(ip) {
        const response = await axios.post(`${dev_base[this.platform]}/apikey/create`, {
            name: ip,
            description: ip,
            cidrRanges: ip
        });
        if (response.data.status.message === 'ok') {
            //console.log('A token was created!');
            return response.data.key.key;
        }
        return null;
    }

    async revokeKey(id) {
        const response = await axios.post(`${dev_base[this.platform]}/apikey/revoke`, {
            id: id
        });
        if (response.data.status.message === 'ok') {
            //console.log('A token was deleted!');
            return true;
        }
        return false;
    }
}

module.exports = SupercellApi;
