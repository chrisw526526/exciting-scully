module.exports = async function handler(req, res) {
  const LEAGUE_ID = 1956519290;
  const SEASON = 2026;

  try {
    const url = `https://fantasy.espn.com/apis/v3/games/flb/seasons/${SEASON}/segments/0/leagues/${LEAGUE_ID}?view=mTeam&view=mRoster`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cookie': `espn_s2=${process.env.ESPN_S2}; SWID=${process.env.ESPN_SWID}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://fantasy.espn.com/baseball/',
        'Origin': 'https://fantasy.espn.com',
        'Accept-Encoding': 'identity'
      }
    });

    const text = await response.text();

    return res.status(200).json({
      httpStatus: response.status,
      responseLength: text.length,
      first300: text.substring(0, 300)
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
