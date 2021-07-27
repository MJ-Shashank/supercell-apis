const SupercellApi = require('./core/Token');
const ClashOfClansApi = require('./core/ClashOfClans');
const ClashRoyaleApi = require('./core/ClashRoyale');
const BrawlStarsApi = require('./core/BrawlStars');

class Token extends SupercellApi {
    constructor(platform = '', email = '', password = '', { name = '', limit = 1 } = {}) {
        super(platform, email, password, { name, limit });
    }

    async init() {
        return this.tokenGeneration();
    }
}

class ClashOfClans extends ClashOfClansApi {
    constructor(token = '', { cache = 0 } = {}) {
        super(token, { cache });
    }
}

class ClashRoyale extends ClashRoyaleApi {
    constructor(token = '', { cache = 0 } = {}) {
        super(token, { cache });
    }
}

class BrawlStars extends BrawlStarsApi {
    constructor(token = '', { cache = 0 } = {}) {
        super(token, { cache });
    }
}

module.exports = { Token, ClashOfClans, ClashRoyale, BrawlStars };