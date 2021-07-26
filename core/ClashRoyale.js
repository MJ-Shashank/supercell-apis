const axios = require('axios');
const qs = require('querystring');
const { errors } = require('./Error');

const api_base = 'https://api.clashroyale.com/v1';

class ClashRoyaleApi {
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

    async riverRaceLog(tag = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/riverracelog' + this._params(options));
    }

    async war(tag = '') {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/currentwar');
    }

    async clan(tag = '') {
        return await this._fetchGet('/clans/' + this._tag(tag));
    }

    async warLog(tag = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/warlog' + this._params(options));
    }

    async members(tag = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/members' + this._params(options));
    }

    async clans(options = { name: '', locationId: '', minMembers: '', maxMembers: '', minScore: '', limit: '', after: '', before: '', labelIds: '' }) {
        return await this._fetchGet('/clans' + this._params(options));
    }

    async currentRiverRace(tag = '') {
        return await this._fetchGet('/clans/' + this._tag(tag) + '/currentriverrace');
    }

    async player(tag = '') {
        return await this._fetchGet('/players/' + this._tag(tag));
    }

    async playerBattleLog(tag = '') {
        return await this._fetchGet('/players/' + this._tag(tag) + '/battlelog');
    }

    async playersUpcomingChests(tag = '') {
        return await this._fetchGet('/players/' + this._tag(tag) + '/upcomingchests');
    }

    async cards(options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/cards' + this._params(options));
    }

    async tournaments(options = { name: '', limit: '', after: '', before: '' }) {
        return await this._fetchGet('/tournaments/' + this._params(options));
    }

    async tournamentsById(tournamentId = '') {
        return await this._fetchGet('/tournaments/' + tournamentId);
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

    async clanWarsRank(locationId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/locations/' + locationId + '/rankings/clanwars' + this._params(options));
    }

    async globalTournamentRank(tournamentId = '', options = { limit: '', after: '', before: '' }) {
        return await this._fetchGet('/locations/global/rankings/tournaments/' + tournamentId + this._params(options));
    }

    async globalTournament() {
        return await this._fetchGet('/globaltournaments');
    }

}

module.exports = ClashRoyaleApi;
