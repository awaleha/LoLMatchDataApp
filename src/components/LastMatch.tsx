"use client";

import { useEffect, useState } from "react";
import { MatchData } from "@/app/page";
import { PlayerData } from "@/app/page";

type LastMatchProps  = {
    match: string;
    player: PlayerData;
}


export default function LastMatch({match, player}: LastMatchProps){
    let champImgPath='';
    const [currentMatch, setCurrentMatch] = useState<MatchData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try{
                setLoading(true);
                setError(null);
                const res = await fetch(
                    `api/matches?matchId=${encodeURIComponent(match)}`
                );
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error || "Failed to load match data");
                }
                setCurrentMatch(data);
            }catch(err: any){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        };
        fetchMatch();
    },[]);


    const participantInfo = () => {

        if (!currentMatch || !player) return "";
        for (let i=0; i<10; i++){
            if(currentMatch.metadata.participants[i] == player.puuid){
                return currentMatch.info.participants[i];
            }
        }
        return null;
    };
    
    const matchResult = () => {
        const participant = participantInfo();
        if (!participant) return "";
        let gameWon = participant.win;

        if(gameWon){
            return "Won <3"
        }else{
            return "Lost :("
        }
    }

    const championName = () => {
        const participant = participantInfo();
        if (!participant) return "";

        let champion = participant.championName;
        champImgPath = `/champion/${champion}.png`
        return champion;
    }

    const gameLength = () => {
        if (!currentMatch)
            return null;

        const minutes = Math.floor(currentMatch.info.gameDuration / 60);
        const seconds = currentMatch.info.gameDuration - minutes * 60;
        
        return `${minutes}:${seconds.toString().padStart(2,"0")}`;
    };

    return(
        <section>
            {loading && 
                <p className="text-gray-500">Loading player data...</p>
            }
            {error && (
                <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">{error}</p>
            )}

            {currentMatch && (
                <div className="bg-blue-100 p-6 rounded-2xl shadow-md mt-4 max-w-md w-full">
                    <h2 
                        className={`text-xl font-semibold mb-2 
                        ${matchResult() == "Won <3" ? "text-green-600" : "text-red-600"}`}>
                        Match Result: { matchResult() }
                    </h2>
                    <p className="text-black flex items-center gap-2">
                        <span>Champion Played: {championName()} </span>
                        <img 
                        src={champImgPath}
                        alt={championName()}
                        className="w-6 h-6 object-contain"/>
                    </p>
                    <p className="text-black mt-1">
                        Game Length: {gameLength() || "N/A"}</p>
                </div>
            )}
        </section>

    ); 
}