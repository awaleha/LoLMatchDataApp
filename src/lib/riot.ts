const RIOT_API_KEY = process.env.RIOT_API_KEY;

if (!RIOT_API_KEY) {
  throw new Error("Missing RIOT_API_KEY");
}

export async function getPlayerByRiotID(gameName: string, tagLine: string, region = "americas"){
  const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

  const res = await fetch(url, {
    headers: { "X-Riot-Token": RIOT_API_KEY! },
    next: { revalidate: 60 },
  });

    if (!res.ok) {
    throw new Error(`Riot API error: ${res.statusText}`);
  }
  console.log(url);
  return res.json();
}

export async function getRecentMatches(puuid: string, region = "americas"){
  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids`;
  const res = await fetch(url, {
    headers: { "X-Riot-Token": RIOT_API_KEY! },
    next: { revalidate: 60 },
  });

    if (!res.ok) {
    throw new Error(`Riot API error: ${res.statusText}`);
  }
  return res.json();
}

export async function getMatch(match: string, region="americas"){
  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(match)}`;

  const res = await fetch(url, {
    headers: { "X-Riot-Token": RIOT_API_KEY! },
    next: { revalidate: 60},
  });
  if (!res.ok) {
    throw new Error(`Riot API error: ${res.statusText}`);
  }
  return res.json();
}