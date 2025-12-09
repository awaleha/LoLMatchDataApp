import { NextResponse } from "next/server";
import { getMatch } from "@/lib/riot";

export async function GET(request: Request){
    const url = new URL(request.url);
    const matchId = url.searchParams.get("matchId");

    if (!matchId) {
        return NextResponse.json({ error: "matchId" }, { status: 400 });
    }
    try{
      const matches = await getMatch(matchId);  
      return NextResponse.json(matches);
    }catch(err:any){
        return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
    }
}