"use client";

import { useEffect, useState } from "react";
import LastMatch from "../components/LastMatch";

export default function Home() {

  const [player, setPlayer] = useState<any>(null);
  const [matches, setMatches] = useState<any>(null);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
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

        const res3 = await fetch(
          `api/matches?matchId=${encodeURIComponent(data2[0])}`
        );
        const data3 = await res3.json();
        if (!res3.ok){
          throw new Error(data.error || "Failed to load match data");
        }

       setCurrentMatch(data3);

      }catch(err: any){
        setError(err.message);
      }finally{
        setLoading(false);
      }
    };
    fetchPlayer();
    
  },[]);

const matchResult = () => {
    let participantID = 10;
    for (let i=0; i<10; i++){
      if(currentMatch.metadata.participants[i] == player.puuid){
        participantID = i;
      }
    }
    let gameWon = currentMatch.info.participants[participantID].win;
    console.log(gameWon);

    if(gameWon){
      return "Won!"
    }else{
      return "Lost :("
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-gray-900/80 backdrop-blur rounded-2xl border border-gray-700 p-8 shadow-xl">
      <h1>Awale's Last game:</h1>
        {loading && <p className="text-gray-500">Loading player data...</p>}
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
           {error}
          </p>
        )}
        
        {player && matches &&  currentMatch && (
          <div className="bg-blue-100 p-6 rounded-2xl shadow-md mt-4 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">
              {player.gameName}#{player.tagLine}
            </h2>
            <LastMatch 
            matchStatus={matchResult()}
            champion="Jinx"
            length="34:12" />
            <p className="text-red-700">
              <strong>Last Match Won?</strong> {matchResult()}
            </p>
            {player.summonerId && (
              <p className="text-blue-700">
                <strong>Summoner ID:</strong> {player.summonerId}
              </p>
            )}
        </div>
        )}
      </section>
    </main>
  );
}


