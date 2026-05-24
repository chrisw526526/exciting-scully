const { Client } = require('espn-fantasy-football-api/node');

module.exports = async function handler(req, res) {
  try {
    const client = new Client({ 
      leagueId: 1956519290,
      espnS2: process.env.ESPN_S2,
      SWID: process.env.ESPN_SWID
    });

    const teams = await client.getTeamsAtWeek({ 
      seasonId: 2026, 
      matchupPeriodId: 8
    });
    
    return res.status(200).json({ 
      success: true, 
      teamCount: teams.length,
      firstTeam: teams[0]
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}
