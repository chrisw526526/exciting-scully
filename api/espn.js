module.exports = async function handler(req, res) {
  const LEAGUE_ID = 1956519290;
  const TEAM_ID = 9;
  const SEASON = 2026;

  try {
    const url = `https://fantasy.espn.com/apis/v3/games/flb/seasons/${SEASON}/segments/0/leagues/${LEAGUE_ID}?view=mTeam&view=mRoster`;

    const response = await fetch(url, {
      headers: {
        'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.ESPN_SWID}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://fantasy.espn.com/',
        'Origin': 'https://fantasy.espn.com'
      }
    });

    const text = await response.text();
    
    // Return raw response so we can see what ESPN is sending back
    return res.status(200).json({ 
      status: response.status,
      first200chars: text.substring(0, 200)
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
