const axios = require('axios');

module.exports = async function handler(req, res) {
  const LEAGUE_ID = 1956519290;
  const SEASON = 2026;

  try {
    const response = await axios.get(
      `https://fantasy.espn.com/apis/v3/games/flb/seasons/${SEASON}/segments/0/leagues/${LEAGUE_ID}?view=mTeam&view=mRoster`,
      {
        headers: {
          'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.ESPN_SWID}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': `https://fantasy.espn.com/baseball/team?leagueId=${LEAGUE_ID}&teamId=9&seasonId=${SEASON}`,
          'x-fantasy-source': 'kona',
          'x-fantasy-platform': 'kona-PROD-e5e4b7bc6948b4ac911fb2f2a786b29cd3f8e3b3',
          'x-fantasy-filter': JSON.stringify({"players":{"filterStatus":{"value":["ONTEAM","INJURED","WAIVERS"]},"filterSlotIds":{"value":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]},"limit":50,"offset":0,"sortPercOwned":{"sortPriority":1,"sortAsc":false}}}),
          'Origin': 'https://fantasy.espn.com'
        },
        timeout: 15000
      }
    );

    return res.status(200).json({
      success: true,
      httpStatus: response.status,
      dataKeys: Object.keys(response.data || {}),
      teamCount: response.data?.teams?.length,
      rawSample: JSON.stringify(response.data).substring(0, 500)
    });

  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data?.toString().substring(0, 300)
    });
  }
}
