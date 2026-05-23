module.exports = async function handler(req, res) {
  try {
    const s2 = process.env.ESPN_S2;
    const swid = process.env.ESPN_SWID;
    
    // Return what we have so we can verify
    return res.status(200).json({ 
      s2_exists: !!s2,
      s2_length: s2?.length,
      swid_exists: !!swid,
      swid_value: swid
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
