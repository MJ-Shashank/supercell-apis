<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://clashforever.xyz/clashforever.png" alt="Project logo"></a>
</p>

<h3 align="center">supercell-apis</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/MJ-Shashank/supercell-apis)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/MJ-Shashank/supercell-apis/blob/master/LICENSE)

</div>

---

<p align="center">A powerful javascript library for interacting with Clash Of Clans, Clash Royale, Brawl Stars api's.
    <br> 
</p>

## Installation

You can install `supercell-apis` using npm:

```
npm install supercell-apis
```

## Example: Configuration

```
const { Token, ClashOfClans, ClashRoyale, BrawlStars } = require('supercell-apis');

(async () => {

    // First argument: clashofclans / clashroyale / brawlstars
    // Second argument: Email
    // Third argument: Password
    // Optional, name and limit
    const token = await new Token('clashofclans', '<email>', '<password>', { name: '<token-name>', limit: '<token-limit>' }).init();
    console.log(token);

    // Clash Of Clans
    const Coc = new ClashOfClans('<token>', { cache: 120 }); // Optional Cache
    const coc_data = await Coc.locations(); 
    console.log(coc_data);

    // Clash Royale
    const Cr = new ClashRoyale('<token>', { cache: 120 }); // Optional Cache
    const cr_data = await Cr.locations();
    console.log(cr_data);

    // Brawl Stars
    const Bs = new BrawlStars('<token>', { cache: 120 }); // Optional Cache
    const bs_data = await Bs.brawlers();
    console.log(bs_data);
})();
```

## List of Apis  

- [Clash Of Clans](#clashofclans)
- [Clash Royale](#clashroyale)
- [Brawl Stars](#brawlstars)


###  'Clash Of Clans' <a name = "clashofclans"></a>

Note: `<>` :  `required` and `{}` : `optional (not always)`

```
.clans({ name: '<required>', warFrequency: '', locationId: '', minMembers: '', maxMembers: '', minClanPoints: '', minClanLevel: '', limit: '', after: '', before: '', labelIds: '' })

.clan('<tag>')

.members('<tag>')

.war('<tag>')

.warLog('<tag>', { limit: '', after: '', before: '' })

.cwlRounds('<tag>') 

.cwl('<tag>') 

.player('<tag>')

.playerVerify('<tag>', '<apiToken>')

.clanLabels({ limit: '', after: '', before: '' }) 

.playerLabels({ limit: '', after: '', before: '' })

.locations('<locationId>', { limit: '', after: '', before: '' })

.clansRank('<locationId>', { limit: '', after: '', before: '' }) 

.playersRank('<locationId>', { limit: '', after: '', before: '' })

.clansVersusRank('<locationId>', { limit: '', after: '', before: '' }) 

.playersVersusRank('<locationId>', { limit: '', after: '', before: '' })

.leagues('<leagueId>', { limit: '', after: '', before: '' })

.warLeagues('<leagueId>', { limit: '', after: '', before: '' })

.leaguesSeason('<leagueId>', '<seasonId>',  { limit: '', after: '', before: '' }) 
```

###  'Clash Royale' <a name = "clashroyale"></a>

Note: `<>` :  `required` and `{}` : `optional (not always)`

```
.riverRaceLog('<tag>', { limit: '', after: '', before: '' })

.war('<tag>')

.clan('<tag>')

.warLog('<tag>', { limit: '', after: '', before: '' }) 

.members('<tag>', { limit: '', after: '', before: '' })

.clans({ name: '<required>', locationId: '', minMembers: '', maxMembers: '', minScore: '', limit: '', after: '', before: '', labelIds: '' }) 

.currentRiverRace('<tag>')

.player('<tag>') 

.playerBattleLog('<tag>') 

.playersUpcomingChests('<tag>')

.cards({ limit: '', after: '', before: '' }) 

.tournaments({ name: '', limit: '', after: '', before: '' })

.tournamentsById('<tournamentId>') 

.locations('<locationId>', { limit: '', after: '', before: '' })

.clansRank('<locationId>', { limit: '', after: '', before: '' }) 

.playersRank('<locationId>', { limit: '', after: '', before: '' }) 

.clanWarsRank('<locationId>', { limit: '', after: '', before: '' }) 

.globalTournamentRank('<tournamentId>', { limit: '', after: '', before: '' })

.globalTournament()
```

###  'Brawl Stars' <a name = "brawlstars"></a>

Note: `<>` :  `required` and `{}` : `optional (not always)`

```
.player('<tag>')

.playerBattleLog('<tag>') 

.club('<tag>')

.members('<tag>') 

.brawlers({ name: '', limit: '', after: '', before: '' })

.brawlersById('<tournamentId>')

.clubsRank('<countryCode>', { limit: '', after: '', before: '' }) 

.playersRank('<countryCode>', { limit: '', after: '', before: '' })

.powerplay('<countryCode>', '<seasonId>', { limit: '', after: '', before: '' }) 

.brawlersRank('<countryCode>', '<brawlersId>',  { limit: '', after: '', before: '' })
```