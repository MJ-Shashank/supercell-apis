const axios = require('axios');
const qs = require('querystring');
const { errors } = require('./Error');

const api_base = 'https://api.clashofclans.com/v1';

class ClashOfClansApi {
    constructor(token, { cache }) {
        this.token = token ? token : '';
        this.cache = cache;
    }

    _tag(tag) {
        return tag ? `%23${tag.toUpperCase().replace(/#/g, '').replace(/O/g, '0')}` : '';
    }

    _params(options) {
        return '?' + qs.stringify(Object.entries(options).reduce((a, [key, value]) => (value ? (a[key] = value, a) : a), {}));
    }

    async _fetchGet(path) {
        try {
            const response = await axios.get(api_base + path, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                    'Cache-Control': `max-age=${this.cache}`
                }
            });
            return { status: response.status, message: errors[response.status], ...response.data };
        }
        catch (error) {
            return { status: error.response.status, message: errors[error.response.status] };
        }
    }

    async _fetchPost(path, body) {
        try {
            const response = await axios({
                method: 'post',
                url: api_base + path,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                data: JSON.stringify(body)
            });
            return { status: response.status, message: errors[response.status], ...response.data };
        }
        catch (error) {
            return { status: error.response.status, message: errors[error.response.status] };
        }
    }

    async clans(options = { name: '', warFrequency: '', locationId: '', minMembers: '', maxMembers: '', minClanPoints: '', minClanLevel: '', limit: '', after: '', before: '', labelIds: '' }) {
        return await this._fetchGet('/clans' + this._params(options));
    }

    async clan(tag = '') {
        return await this._fetchGet('/clans/' + this._tag(tag));
    }

    async members(tag = '') {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/members');
    }

    async war(tag = '') {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/currentwar');
    }

    async warLog(tag = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/warlog' + this._params(options));
    }

    async cwlRounds(tag = '') {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/currentwar/leaguegroup');
    }

    async cwl(tag = '') {
        return await this._fetchGet('/clanwarleagues/wars/' + this._tag(tag));
    }

    async player(tag = '') {
        return await this._fetchGet('/players/' + this._tag(tag));
    }

    async playerVerify(tag = '', apiToken = '') {
        return await this._fetchPost('/players/' + this._tag(tag) + '/verifytoken', { token: apiToken });
    }

    async clanLabels(options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/labels/clans' + this._params(options));
    }

    async playerLabels(options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/labels/players' + this._params(options));
    }

    async locations(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/locations/' + locationId + this._params(options));
    }

    async clansRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/locations/' + locationId + '/rankings/clans' + this._params(options));
    }

    async playersRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/locations/' + locationId + '/rankings/players' + this._params(options));
    }

    async clansVersusRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/locations/' + locationId + '/rankings/clans-versus' + this._params(options));
    }

    async playersVersusRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/locations/' + locationId + '/rankings/players-versus' + this._params(options));
    }

    async leagues(leagueId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/leagues/' + leagueId + this._params(options));
    }

    async warLeagues(leagueId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/warleagues/' + leagueId + this._params(options));
    }

    async leaguesSeason(leagueId = '', seasonId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/leagues/' + leagueId + '/seasons/' + seasonId + this._params(options));
    }
}

module.exports = ClashOfClansApi;
