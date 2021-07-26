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
    constructor(platform, email, password, { name, limit }) {
        this.platform = platform.toLowerCase();
        this.email = email.toLowerCase();
        this.password = password;
        this.name = name || 'localhost';
        this.limit = (limit > 10 ? 10 : (limit < 1 ? 1 : limit)) || 1;
    }

    async tokenGeneration() {
        try {
            if (this.platform === '' || this.email === '' || this.password === '') {
                throw new Error('Please enter platform/email/password.');
            }

            if (!['clashofclans', 'clashroyale', 'brawlstars'].includes(this.platform)) {
                throw new Error('Please enter a correct platform.');
            }

            let login_session = await this.loginSession();

            if (!login_session) {
                throw new Error('Incorrect email/password!');
            }

            let keys = await this.getKeys();
            let ip = await getIP();

            if (keys && keys.filter(k => k.cidrRanges.includes(ip) && k.name === this.name).length === this.limit) {
                console.log('Old token in use!');
                return keys.filter(k => k.cidrRanges.includes(ip) && k.name === this.name).map(m => m.key);
            }
            else {

                var full = keys.length - keys.filter(k => k.cidrRanges.includes(ip) && k.name === this.name).length + this.limit;
                if (full.length > 10) {
                    throw new Error('Please manually delete some token!');
                }

                let count = 0;
                let keysLength = keys.length;
                let matchedKeys = keys.filter(k => k.name === this.name);
                for (let i = 0; i < matchedKeys.length; i++) {
                    if (i >= this.limit) {
                        await this.revokeKey(matchedKeys[i].id);
                        keys.filter(f => f.id !== matchedKeys[i].id);
                        keysLength--;
                    }
                    if (matchedKeys[i].cidrRanges.includes(ip)) {
                        count++;
                    }
                }

                matchedKeys = keys.filter(k => k.name === this.name);
                for (let i = 0; i < matchedKeys.length; i++) {
                    if (matchedKeys[i].name === this.name && !matchedKeys[i].cidrRanges.includes(ip) && keysLength <= 10 && count < this.limit) {
                        await this.revokeKey(keys.find(f => f.id === matchedKeys[i].id).id);
                        await this.createKey(ip);
                        count++;
                    }
                }

                for (let i = 0; i < this.limit - count; i++) {
                    if (keysLength < 10) {
                        await this.createKey(ip);
                        keysLength++;
                    }
                }

                return await this.getKeys().then(keys => keys.filter(k => k.cidrRanges.includes(ip) && k.name === this.name).map(m => m.key));
            }
        }
        catch (error) {
            console.log(error.message);
            return [];
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
            name: this.name,
            description: ip,
            cidrRanges: ip
        });
        if (response.data.status.message === 'ok') {
            // console.log('A token was created!');
            return response.data.key.key;
        }
        return null;
    }

    async revokeKey(id) {
        const response = await axios.post(`${dev_base[this.platform]}/apikey/revoke`, {
            id: id
        });
        if (response.data.status.message === 'ok') {
            // console.log('A token was deleted!');
            return true;
        }
        return false;
    }
}

module.exports = SupercellApi;
