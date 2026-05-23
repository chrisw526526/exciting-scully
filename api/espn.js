module.exports = async function handler(req, res) {
  const LEAGUE_ID = 1956519290;
  const TEAM_ID = 9;
  const SEASON = 2026;

  try {
    const url = `https://fantasy.espn.com/apis/v3/games/flb/seasons/${SEASON}/segments/0/leagues/${LEAGUE_ID}?view=mTeam&view=mRoster`;

    const response = await fetch(url, {
      headers: {
        'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.ESPN_SWID}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`ESPN returned ${response.status}`);
    }

    const data = await response.json();
    const team = data.teams?.find(t => t.id === TEAM_ID);
    if (!team) throw new Error('Team not found');

    const wins = team.record?.overall?.wins || 0;
    const losses = team.record?.overall?.losses || 0;

    const roster = { batters: [], pitchers: [] };
    const entries = team.roster?.entries || [];

    entries.forEach(entry => {
      const player = entry.playerPoolEntry?.player;
      if (!player) return;
      const name = player.fullName;
      const slot = entry.lineupSlotId;
      const eligible = player.eligibleSlots || [];
      const isPitcher = eligible.some(s => [1, 11, 13].includes(s));
      const posMap = {1:'SP',2:'C',3:'1B',4:'2B',5:'3B',6:'SS',7:'OF',8:'OF',9:'OF',10:'DH',11:'RP',12:'UTIL',13:'P',14:'BE',15:'IL'};
      const teamMap = {1:'ATL',2:'CHC',3:'CIN',4:'HOU',5:'LAD',6:'MIL',7:'NYM',8:'PHI',9:'PIT',10:'STL',11:'ARI',12:'COL',13:'MIA',14:'SF',15:'SD',16:'WSH',17:'BAL',18:'BOS',19:'CHW',20:'CLE',21:'DET',22:'KC',23:'LAA',24:'MIN',25:'NYY',26:'OAK',27:'SEA',28:'TB',29:'TEX',30:'TOR'};
      const obj = {
        name,
        pos: posMap[slot] || 'BE',
        team: teamMap[player.proTeamId] || 'UNK',
        status: slot === 15 ? 'il' : slot === 14 ? 'bench' : 'active'
      };
      if (isPitcher) roster.pitchers.push(obj);
      else roster.batters.push(obj);
    });

    return res.status(200).json({
      roster,
      record: `${wins}-${losses}`,
      faab: null
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}