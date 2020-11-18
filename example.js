const { Token, ClashOfClans, ClashRoyale, BrawlStars } = require('supercell-apis');

(async () => {

    // First argument: clashofclans / clashroyale / brawlstars
    // Second argument: Email
    // Third argument: Password
    // Optional, pass token to init('<token>') to check token.
    const token = await new Token('clashofclans', '<email>', '<password>').init();
    console.log(token);

    // Clash Of Clans
    const Coc = new ClashOfClans('<token>');
    const coc_data = await Coc.locations();
    console.log(coc_data);

    // Clash Royale
    const Cr = new ClashRoyale('<token>');
    const cr_data = await Cr.locations();
    console.log(cr_data);

    // Brawl Stars
    const Bs = new BrawlStars('<token>');
    const bs_data = await Bs.brawlers();
    console.log(bs_data);
})();