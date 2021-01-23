import React from "react";
import { GameConnection } from "../../../game";
import "./MissionPrompter.css";

const cascadiaBriefing = `# MISSION BRIEFING

US LOYALISTS HAVE MOVED INTO THE NORTHERN
AREAS OF THE SOUND NEAR WHIDBEY ISLAND. A
VIRGINIA CLASS SUBMARINE WAS SEEN PATROLLING
NEAR SHILSHOLE BAY AT 0700 THIS MORNING. 
OTHER FORCES MAY BE PRESENT, USE CAUTION. 
BREAK THE BLOCKADE BY ANY MEANS NECESSARY.`;

const blockersBriefing = `# MISSION BRIEIFING

CONTINUE PATROLS AND BLOCKADE OF THE SOUND.
INTEL SUGGESTS CASCADIAN REBELS HAVE SIEZED
SSN-22, A SEAWOLF CLASS SUB, AND MAY BE
ATTEMPTING TO BREAK THE BLOCKADE. CAUTIOUSLY
INVESTIGATE ANY CONTACTS TO THE SOUTH. YOU
ARE CLEARED TO ENGAGE ANY HOSTILE TARGETS.`;

const MissionPrompter = ({ game }: { game: GameConnection }) => {
  const briefing =
    game.vesselId === "rebels" ? cascadiaBriefing : blockersBriefing;
  return (
    <div className="mission-briefing card">
      <pre>{briefing}</pre>
    </div>
  );
};

export default MissionPrompter;
