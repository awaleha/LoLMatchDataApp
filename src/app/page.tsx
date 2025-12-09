"use client";

import { useEffect, useState } from "react";
import LastMatch from "../components/LastMatch";

export interface MatchData{
  metadata: {
    participants: string[];
  };
  info: {
    gameDuration: number
    participants: {
      win: boolean;
      championName: string;
    }[];
  };
}

export interface PlayerData{
  puuid : string,
  gameName: string,
  tagLine: string,
}

export default function Home() {

  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [matches, setMatches] = useState<Record<number, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const gameName = "RebelliousPirate"
  const tagLine = "NA1"


  useEffect(() =>{
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `api/player?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
        );

        const data = await res.json();
        if (!res.ok){
          throw new Error(data.error || "Failed to load player data");
        }
        setPlayer(data);

        const res2 = await fetch(
          `api/matches/by-puuid?puuid=${encodeURIComponent(data.puuid)}`
        );
        const data2 = await res2.json();
        if (!res2.ok){
          throw new Error(data.error || "Failed to load match IDs");
        }
        setMatches(data2); 

      }catch(err: any){
        setError(err.message);
      }finally{
        setLoading(false);
      }
    };
    fetchPlayer();
    
  },[]);

  const recentMatches = () => {
    return matches ? Object.values(matches).slice(0,5) : [];
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-gray-900/80 backdrop-blur rounded-2xl border border-gray-700 p-8 shadow-xl">
      <h1>Awale's 5 Last games:</h1>
        {loading && <p className="text-gray-500">Loading player data...</p>}
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
           {error}
          </p>
        )}
        
        {player && matches && (
          <ul>
            <li> <LastMatch match={recentMatches()[0]} player={ player } /></li>
            <li> <LastMatch match={recentMatches()[1]} player={ player } /></li>
            <li> <LastMatch match={recentMatches()[2]} player={ player } /></li>
            <li> <LastMatch match={recentMatches()[3]} player={ player } /></li>
            <li> <LastMatch match={recentMatches()[4]} player={ player } /></li>
          </ul>
        )}
      </section>
    </main>
  );
}


