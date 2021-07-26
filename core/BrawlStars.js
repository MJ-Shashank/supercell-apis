const axios = require('axios');
const qs = require('querystring');
const moment = require('moment');
const { errors } = require('./Error');

require('dotenv').config();

const api_base = 'https://api.brawlstars.com/v1';
let cache = {};

class BrawlStarsApi {
    constructor(token) {
        this.token = token ? token : '';
    }

    _tag(tag) {
        return tag ? `%23${tag.toUpperCase().replace(/#/g, '').replace(/O/g, '0')}` : '';
    }

    _params(options) {
        return '?' + qs.stringify(Object.entries(options).reduce((a, [key, value]) => (value ? (a[key] = value, a) : a), {}));
    }

    async _fetch(path) {
        try {
            if (cache[path]) {
                if (moment() > moment(cache[path].expires)) {
                    delete cache[path];
                } else {
                    return { isCached: true, ...cache[path].data };
                }
            }

            const response = await axios.get(api_base + path, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if ((process.env.CACHE_SECONDS || 0) > 0 && response.status == 200) {
                cache[path] = { data: response.data, expires: moment().add(process.env.CACHE_SECONDS, 's') };
            }

            return { status: response.status, message: errors[response.status], ...response.data };
        }
        catch (error) {
            return { status: error.response.status, message: errors[error.response.status] };
        }
    }

    async player(tag = '') {
        return await this._fetch('/players/' + this._tag(tag));
    }

    async playerBattleLog(tag = '') {
        return await this._fetch('/players/' + this._tag(tag) + '/battlelog');
    }

    async club(tag = '') {
        return await this._fetch('/clubs/' + this._tag(tag));
    }

    async members(tag = '') {
        return await this._fetch('/clubs/' + this._tag(tag) + '/members');
    }

    async brawlers(options = { name: '', limit: '', after: '', before: '' }) {
        return await this._fetch('/brawlers/' + this._params(options));
    }

    async brawlersById(tournamentId = '') {
        return await this._fetch('/brawlers/' + tournamentId);
    }

    async clubsRank(countryCode = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/rankings/' + countryCode + '/clubs' + this._params(options));
    }

    async playersRank(countryCode = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/rankings/' + countryCode + '/players' + this._params(options));
    }

    async powerplay(countryCode = '', seasonId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/rankings/' + countryCode + '/powerplay/seasons/' + seasonId + this._params(options));
    }

    async brawlersRank(countryCode = '', brawlersId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/rankings/' + countryCode + '/brawlers/' + brawlersId + this._params(options));
    }
}

module.exports = BrawlStarsApi;
