import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;
const CLIENT_ID = process.env.OPENSKY_CLIENT_ID;
const CLIENT_SECRET = process.env.OPENSKY_CLIENT_SECRET;
const TOKEN_URL = 'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token';
const BASE_API_URL = 'https://opensky-network.org/api';

// Token Management state
let cachedToken = null;
let expiresAt = 0;
const REFRESH_MARGIN_SEC = 30;

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < expiresAt) {
    return cachedToken;
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Auth failed with status ${res.status}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  const expiresIn = data.expires_in || 1800;
  expiresAt = now + (expiresIn - REFRESH_MARGIN_SEC);

  return cachedToken;
}

// Endpoint: Fetch Hourly Arrivals & Departures for Newark Airport (KEWR)
app.get('/api/ewr-hourly-flights', async (req, res) => {
  try {
    const token = await getAccessToken();

    // Query 24 hours (Unix timestamps in seconds)
    const end = Math.floor(Date.now() / 1000);
    const begin = end - 24 * 3600;

    const headers = { Authorization: `Bearer ${token}` };

    const [arrivalsRes, departuresRes] = await Promise.all([
      fetch(`${BASE_API_URL}/flights/arrival?airport=KEWR&begin=${begin}&end=${end}`, { headers }),
      fetch(`${BASE_API_URL}/flights/departure?airport=KEWR&begin=${begin}&end=${end}`, { headers }),
    ]);

    const arrivals = arrivalsRes.ok ? await arrivalsRes.json() : [];
    const departures = departuresRes.ok ? await departuresRes.json() : [];

    // Group arrivals and departures by hour (0 to 23)
    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      hourNum: hour,
      arrivals: 0,
      departures: 0,
      total: 0,
    }));

    arrivals.forEach((f) => {
      if (f.lastSeen) {
        const h = new Date(f.lastSeen * 1000).getHours();
        hourlyStats[h].arrivals += 1;
        hourlyStats[h].total += 1;
      }
    });

    departures.forEach((f) => {
      if (f.firstSeen) {
        const h = new Date(f.firstSeen * 1000).getHours();
        hourlyStats[h].departures += 1;
        hourlyStats[h].total += 1;
      }
    });

    res.json({
      timestamp: new Date().toISOString(),
      airport: 'EWR / KEWR (Newark Liberty International)',
      data: hourlyStats,
    });
  } catch (err) {
    console.error('API Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch flight data', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});