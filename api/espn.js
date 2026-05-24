const axios = require('axios');

module.exports = async function handler(req, res) {
  const LEAGUE_ID = 1956519290;
  const SEASON = 2026;

  try {
    const response = await axios.get(
      `https://fantasy.espn.com/apis/v3/games/flb/seasons/${SEASON}/segments/0/leagues/${LEAGUE_ID}`,
      {
        params: {
          view: ['mTeam', 'mRoster']
        },
        headers: {
          'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.ESPN_SWID}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Referer': 'https://fantasy.espn.com/baseball/team',
          'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
        },
        decompress: true,
        timeout: 10000
      }
    );

    const team = response.data?.teams?.find(t => t.id === 9);

    return res.status(200).json({
      success: true,
      httpStatus: response.status,
      teamFound: !!team,
      record: team ? `${team.record?.overall?.wins}-${team.record?.overall?.losses}` : null,
      rosterCount: team?.roster?.entries?.length || 0
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
