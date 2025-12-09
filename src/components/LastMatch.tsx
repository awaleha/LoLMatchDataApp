"use client";

import { useEffect, useState } from "react";

type LastMatch = {
    matchStatus : string;
    champion : string;
    length : string
}

export default function LastMatch({matchStatus, champion, length}: LastMatch){
    return(
        <p className="text-black">
            Last Match: {matchStatus}
            <br />Champion Played: {champion}
            <br />Game Length: {length}</p>
    ); 
}