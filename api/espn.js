const axios = require('axios');

module.exports = async function handler(req, res) {
  const LEAGUE_ID = 1956519290;
  const SEASON = 2026;

  try {
    const response = await axios.get(
      `https://fantasy.espn.com/apis/v3/games/flb/seasons/${SEASON}/segments/0/leagues/${LEAGUE_ID}?view=mTeam&view=mRoster&view=mMatchup`,
      {
        headers: {
          'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.ESPN_SWID}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://fantasy.espn.com/baseball/team',
          'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
        },
        timeout: 10000
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
