module.exports = async function handler(req, res) {
  const LEAGUE_ID = 1956519290;
  const SEASON = 2026;
  const SCORING_PERIOD = 8;

  try {
    const url = `https://fantasy.espn.com/apis/v3/games/flb/seasons/${SEASON}/segments/0/leagues/${LEAGUE_ID}?view=mTeam&view=mRoster&view=mMatchup&view=mSettings&scoringPeriodId=${SCORING_PERIOD}`;

    const response = await fetch(url, {
      headers: {
        'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.ESPN_SWID}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://fantasy.espn.com/baseball/',
        'Origin': 'https://fantasy.espn.com',
        'x-fantasy-source': 'kona',
        'x-fantasy-platform': 'kona-PROD-e5e4b7bc6948b4ac911fb2f2a786b29cd3f8e3b3'
      }
    });

    const text = await response.text();
    
    // Check if we got HTML instead of JSON
    if (text.trim().startsWith('<')) {
      return res.status(200).json({ 
        success: false, 
        message: 'ESPN returned HTML - authentication failed',
        status: response.status
      });
    }

    const data = JSON.parse(text);
    const team = data.teams?.find(t => t.id === 9);
    
    if (!team) {
      return res.status(200).json({ 
        success: false, 
        message: 'Team not found',
        teamCount: data.teams?.length,
        status: response.status
      });
    }

    return res.status(200).json({ 
      success: true,
      record: `${team.record?.overall?.wins || 0}-${team.record?.overall?.losses || 0}`,
      rosterEntries: team.roster?.entries?.length || 0
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
