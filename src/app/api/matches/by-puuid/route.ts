import { NextResponse } from "next/server";
import { getRecentMatches } from "@/lib/riot";

export async function GET(request: Request){
    const url = new URL(request.url);
    const puuid = url.searchParams.get("puuid");

    if (!puuid) {
        return NextResponse.json({ error: "puuid" }, { status: 400 });
    }
    try{
      const matches = await getRecentMatches(puuid);  
      return NextResponse.json(matches);
    }catch(err:any){
        return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
    }
}