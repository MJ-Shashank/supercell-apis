const axios = require('axios');
const qs = require('querystring');
const moment = require('moment');
const { errors } = require('./Error');

require('dotenv').config();

const api_base = 'https://api.clashofclans.com/v1';
let cache = {};

class ClashOfClansApi {
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

    async clans(options = { name: '', warFrequency: '', locationId: '', minMembers: '', maxMembers: '', minClanPoints: '', minClanLevel: '', limit: '', after: '', before: '', labelIds: '' }) {
        return await this._fetch('/clans' + this._params(options));
    }

    async clan(tag = '') {
        return await this._fetch('/clans/' + this._tag(tag));
    }

    async members(tag = '') {
        return await this._fetch('/clans/' + this._tag(tag) + '/members');
    }

    async war(tag = '') {
        return await this._fetch('/clans/' + this._tag(tag) + '/currentwar');
    }

    async warLog(tag = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/clans/' + this._tag(tag) + '/warlog' + this._params(options));
    }

    async cwlRounds(tag = '') {
        return await this._fetch('/clans/' + this._tag(tag) + '/currentwar/leaguegroup');
    }

    async cwl(tag = '') {
        return await this._fetch('/clanwarleagues/wars/' + this._tag(tag));
    }

    async player(tag = '') {
        return await this._fetch('/players/' + this._tag(tag));
    }

    async clanLabels(options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/labels/clans' + this._params(options));
    }

    async playerLabels(options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/labels/players' + this._params(options));
    }

    async locations(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/locations/' + locationId + this._params(options));
    }

    async clansRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/locations/' + locationId + '/rankings/clans' + this._params(options));
    }

    async playersRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/locations/' + locationId + '/rankings/players' + this._params(options));
    }

    async clansVersusRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/locations/' + locationId + '/rankings/clans-versus' + this._params(options));
    }

    async playersVersusRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/locations/' + locationId + '/rankings/players-versus' + this._params(options));
    }

    async leagues(leagueId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/leagues/' + leagueId + this._params(options));
    }

    async warLeagues(leagueId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/warleagues/' + leagueId + this._params(options));
    }

    async leaguesSeason(leagueId = '', seasonId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetch('/leagues/' + leagueId + '/seasons/' + seasonId + this._params(options));
    }
}

module.exports = ClashOfClansApi;
