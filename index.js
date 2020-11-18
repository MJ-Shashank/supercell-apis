const SupercellApi = require('./core/Token');
const ClashOfClansApi = require('./core/ClashOfClans');
const ClashRoyaleApi = require('./core/ClashRoyale');
const BrawlStarsApi = require('./core/BrawlStars');

class Token extends SupercellApi {
    constructor(platform = '', email = '', password = '') {
        super(platform, email, password);
    }

    async init(token = '') {
        return this.tokenGeneration(token);
    }
}

class ClashOfClans extends ClashOfClansApi {
    constructor(token = '') {
        super(token);
    }
}

class ClashRoyale extends ClashRoyaleApi {
    constructor(token = '') {
        super(token);
    }
}

class BrawlStars extends BrawlStarsApi {
    constructor(token = '') {
        super(token);
    }
}

module.exports = { Token, ClashOfClans, ClashRoyale, BrawlStars };