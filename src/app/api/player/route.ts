import { NextResponse } from "next/server";
import { getPlayerByRiotID } from "@/lib/riot";

export async function GET(request: Request){
    const url = new URL(request.url);
    const gameName = url.searchParams.get("gameName");
    const tagLine = url.searchParams.get("tagLine");

    if (!gameName || !tagLine) {
        return NextResponse.json({ error: "Missing gameName or tagLine" }, { status: 400 });
    }
    try{
      const player = await getPlayerByRiotID(gameName, tagLine);  
      return NextResponse.json(player);
    }catch(err:any){
        return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
    }
}