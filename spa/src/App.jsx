import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- FALLBACK DATA ---
// Used if the API is unreachable or fails (e.g. CORS issues, offline)
const FALLBACK_GAME_DATA = {
  "gameData": {
    "game_title": "The Velvet Shadow",
    "theme": "Film Noir - A smoky tale of betrayal in the city's underbelly",
    "stages": [
      {
        "stage_order": 1,
        "stage_id": "briefing",
        "display_data": {
          "header": "Case Briefing: Vincent 'Vinnie' Malone",
          "atmosphere_intro": "Rain hammers the cracked pavement like a thousand desperate fingers. The neon sign of The Velvet Room flickers its dying breath into the fog-choked street. 🌧️ Inside, cigarette smoke curls around the body like a ghost refusing to leave. ☁️",
          "partner_dialogue": "Detective Murphy leans against the bar, his fedora dripping. 'Vinnie Malone. Club owner, loan shark, and by all accounts, a real charmer with the ladies and a real bastard with everyone else. Found him an hour ago, face-down in his own office. Single gunshot to the chest. 🔫 Here's the kicker—the office was locked from the inside, and the only key was in his pocket. The window's painted shut. Whoever did this, they were either a ghost... or someone Vinnie trusted enough to let them walk right out the front door with a smile.'",
          "quick_facts": {
            "victim": "Vincent 'Vinnie' Malone - Nightclub Owner & Loan Shark 🎰",
            "cause_of_death": "Single gunshot wound to the chest 💀",
            "initial_clue": "A woman's silk glove (left hand) clutched in victim's hand 🧤",
            "complication": "Locked room mystery - door locked from inside, only key in victim's pocket 🔐"
          }
        }
      },
      {
        "stage_order": 2,
        "stage_id": "evidence_collection",
        "description": "The player visits four specific locations to gather findings.",
        "locations": [
          {
            "id": "crime_scene_office",
            "name": "Vinnie's Private Office",
            "description": "A cramped room reeking of bourbon and betrayal. The desk is mahogany, the carpet Persian, both now stained with blood.",
            "findings": [
              "An empty glass with lipstick stain (deep crimson shade) on the rim, sitting on the desk",
              "A ledger showing Vinnie loaned $5,000 to 'J.H.' three months ago, marked 'OVERDUE - FINAL WARNING'",
              "A half-written letter beginning 'My dearest C—, Tonight I'll tell her everything. We can finally be together...'",
              "Faint scent of expensive perfume (Chanel No. 5) lingering in the air despite the cigarette smoke"
            ]
          },
          {
            "id": "backstage_dressing",
            "name": "Performers' Dressing Room",
            "description": "A narrow room lined with mirrors and costumes. The air is thick with hairspray and whispered secrets.",
            "findings": [
              "A matching right-hand silk glove in Stella Fontaine's locker, part of her stage costume",
              "Photograph tucked in Cora's mirror frame: Vinnie and Cora embracing on a beach, dated six months ago",
              "Stella's diary entry from yesterday: 'He promised me the lead. Now he's giving MY number to that tramp Cora. I won't be humiliated again.'",
              "A small pistol (unloaded) hidden in Dolores Kane's makeup case, registered in her name",
              "Stella's signature white fur coat hanging prominently on a hook with her name embroidered in gold thread"
            ]
          },
          {
            "id": "bar_main_floor",
            "name": "The Velvet Room Bar",
            "description": "Chrome and leather, with a long mirror behind rows of bottles that have seen better days.",
            "findings": [
              "Bartender Tommy recalls: 'Cora went upstairs around 10:15 PM. Came down at 10:40, looked shaken, left immediately through the back.'",
              "Tommy also mentions: 'Jack Halloway was here earlier, arguing with Vinnie about money. Vinnie laughed in his face, said he'd take Jack's car next.'",
              "Cigarette butts in ashtray - three different lipstick shades: crimson, pink, and nude",
              "A napkin with a note in masculine handwriting: 'Midnight. Come alone. We finish this.' - found crumpled near the phone booth",
              "Tommy adds: 'Stella? Yeah, she was here too. Saw her heading upstairs around 10:25, right after Cora came down. She had that look—you know, the one dames get when they're about to do something they can't take back.'"
            ]
          },
          {
            "id": "back_alley",
            "name": "Back Alley Behind The Velvet Room",
            "description": "Garbage bins and fire escapes. Where secrets come to die in the city's forgotten corners.",
            "findings": [
              "Fresh tire marks from a car that left in a hurry - tread pattern matches a 1948 Packard",
              "A crimson lipstick tube (same shade as the glass upstairs) dropped near the back door - brand is 'Scarlet Siren,' same shade Stella wears",
              "Witness (homeless man) reports: 'Saw a dame in a fur coat leave through the back around 10:45. She was crying, kept looking back at the door.'",
              "A spent .38 caliber shell casing in the dumpster, recently fired (same caliber as the murder weapon)",
              "The homeless man adds: 'That fur coat? White as snow, real fancy. Stood out like a angel in hell.'"
            ]
          }
        ]
      },
      {
        "stage_order": 3,
        "stage_id": "suspect_interrogation",
        "objective": "Choose the killer based on Motive, Means, and Opportunity.",
        "correct_suspect": "Stella Fontaine",
        "suspect_list": [
          {
            "name": "Cora DeVille",
            "motive": "Vinnie's mistress who was about to be revealed to his wife. The letter suggests he was planning to leave someone for her.",
            "supporting_fact": "She was seen leaving the scene shaken at 10:40 PM. Her photograph with Vinnie shows a romantic relationship. The perfume scent in the office matches what she wears. However, the timeline shows she left BEFORE the estimated time of death (10:30-10:40 PM), and she wears pink lipstick, not crimson."
          },
          {
            "name": "Jack Halloway",
            "motive": "Owed Vinnie $5,000 and was threatened with losing his car. Desperate men do desperate things.",
            "supporting_fact": "The ledger shows 'J.H.' with a massive overdue debt marked 'FINAL WARNING.' He was seen arguing with Vinnie earlier that evening about money. The threatening note could be his handwriting. However, no physical evidence places him at the scene during the murder window, and the glove is clearly a woman's."
          },
          {
            "name": "Dolores Kane",
            "motive": "Vinnie's wife who may have discovered his affair with Cora and wanted revenge.",
            "supporting_fact": "She owns a pistol (found in her makeup case). As his wife, she would have easy access to his office and he would trust her enough to turn his back. She wears nude lipstick. However, her pistol was unloaded, and no evidence places her at The Velvet Room that night."
          },
          {
            "name": "Stella Fontaine",
            "motive": "Star performer who was being replaced by Cora. Professional jealousy turned deadly when Vinnie broke his promise to her.",
            "supporting_fact": "The silk glove clutched in Vinnie's hand matches the one in her locker. Her diary reveals intense anger at Vinnie and premeditation ('I won't be humiliated again'). Her crimson lipstick was found in the alley, and she wears the same shade found on the glass. She was seen going upstairs at 10:25 PM. A witness saw a woman in a white fur coat—Stella's signature coat—fleeing at 10:45 PM, crying."
          }
        ]
      },
      {
        "stage_order": 4,
        "stage_id": "conclusion",
        "title": "The Conclusion",
        "outcome": "Success (Case Closed)",
        "solution_details": {
          "killer": "Stella Fontaine",
          "motive": "Stella Fontaine murdered Vincent Malone out of rage and humiliation. Vinnie had promised her the lead performance slot at The Velvet Room, but instead gave her signature number to Cora DeVille, his new mistress. For a performer whose career was fading, this betrayal was the final insult. She had given Vinnie everything—her talent, her loyalty, even her dignity—and he cast her aside for younger prey. The locked room wasn't magic; Stella simply walked out the front door after shooting Vinnie. He trusted her enough not to suspect danger, and she used that trust to get close. She locked the door from the inside with the key, then slipped it back into his pocket as he lay dying—a final intimate gesture from a woman scorned.",
          "evidence_correlation": [
            {
              "clue": "The silk glove (left hand) clutched in Vinnie's hand matches the right-hand glove found in Stella's locker",
              "explanation": "These gloves were part of Stella's stage costume. When Vinnie grabbed at her in his final moments, he tore the left glove from her hand. She couldn't retrieve it without risking being caught, so she fled, leaving behind the damning evidence."
            },
            {
              "clue": "The crimson lipstick tube ('Scarlet Siren' brand) found in the back alley matches Stella's signature shade and the lipstick stain on the glass in Vinnie's office",
              "explanation": "Stella shared a drink with Vinnie before shooting him—the glass with crimson lipstick proves she was in the office. She dropped her lipstick tube while fleeing through the back alley in panic, the same shade that marked the glass. Cora wore pink, and Dolores wore nude tones."
            },
            {
              "clue": "Stella's diary entry: 'He promised me the lead. Now he's giving MY number to that tramp Cora. I won't be humiliated again.'",
              "explanation": "This entry, written just one day before the murder, establishes clear premeditation. Stella wasn't acting in the heat of passion—she had already decided she 'won't be humiliated again,' showing intent to take action against Vinnie."
            },
            {
              "clue": "The witness saw 'a dame in a fur coat leave through the back around 10:45, crying and looking back' and described it as 'white as snow, real fancy'—matching Stella's signature white fur coat",
              "explanation": "Stella was known for wearing her signature white fur coat during performances, found hanging in her dressing room area. The timeline places her leaving just after the murder occurred (around 10:30-10:40 PM based on body temperature). She was crying—not from grief, but from the realization of what she'd done."
            }
          ]
        }
      }
    ]
  }
};

export default function App() {
  // --- STATE ---
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stage, setStage] = useState('intro'); // 'intro', 'briefing', 'evidence_collection', 'suspect_interrogation', 'conclusion'
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [revealedClues, setRevealedClues] = useState([]); 
  
  // Scoring State
  const [score, setScore] = useState(1500);
  const [lastScoreChange, setLastScoreChange] = useState(null); // { type: 'win'|'loss', amount, bonus, cluesUsed }

  // Modals
  const [evidenceModal, setEvidenceModal] = useState({ show: false, data: null });
  const [suspectModal, setSuspectModal] = useState({ show: false, title: '', message: '', correct: false });

  // Background Image Logic
  const MZ_IMG_INTRO = 'https://i.imgur.com/G3cLxS8.gif';
  const MZ_IMG_BRIEFING = 'https://i.imgur.com/iqioKnE.gif';
  const MZ_IMG_INVESTIGATION = 'https://i.imgur.com/MHfLJSY.png';
  const MZ_IMG_SUSPECTS = 'https://i.imgur.com/aMU7nyM.gif';
  
  // --- API FETCH ---
  const fetchGameData = async () => {
    setLoading(true);
    setError(null);
    try {
      // UPDATED FETCH: Uses local proxy path "/api" instead of full URL
      // This routes through vite.config.js to avoid CORS errors
      const response = await fetch('/api/games/random', {
        method: 'GET',
        headers: {
          'x-api-key': 'R2Php90kpH5BypjJUxeAW87zL8nMzHvz1TBLJx6N'
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setGameData(data.gameData);
    } catch (err) {
      console.warn("API unavailable (running offline mode):", err);
      // Fail gracefully to fallback data
      setGameData(FALLBACK_GAME_DATA.gameData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const getBg = () => {
    switch(stage) {
      case 'intro': return MZ_IMG_INTRO;
      case 'briefing': return MZ_IMG_BRIEFING;
      case 'evidence_collection': return MZ_IMG_INVESTIGATION;
      case 'suspect_interrogation': return MZ_IMG_SUSPECTS;
      case 'conclusion': return MZ_IMG_BRIEFING;
      default: return MZ_IMG_INTRO;
    }
  };

  // --- ACTIONS ---
  const handleSetStage = (newStage) => {
    setStage(newStage);
    window.scrollTo(0, 0);
  };

  const openEvidence = (loc) => {
    setEvidenceModal({ show: true, data: loc });
    if (!visitedLocations.includes(loc.id)) {
      const newVisited = [...visitedLocations, loc.id];
      setVisitedLocations(newVisited);
    }
  };

  const handleRevealClue = (locId, index) => {
    const clueId = `${locId}-${index}`;
    if (!revealedClues.includes(clueId)) {
      setRevealedClues([...revealedClues, clueId]);
    }
  };

  const selectSuspect = (suspectName) => {
    const suspectStage = gameData.stages.find(s => s.stage_id === 'suspect_interrogation');
    const CORRECT_KILLER = suspectStage.correct_suspect;

    if (suspectName === CORRECT_KILLER) {
      // Victory Calculation
      const baseReward = 50;
      const cluesUsed = revealedClues.length;
      const penaltyPerClue = 5;
      // Start with 30 bonus, subtract 5 per clue, min 0
      const efficiencyBonus = Math.max(0, 30 - (cluesUsed * penaltyPerClue));
      const totalPoints = baseReward + efficiencyBonus;

      setScore(prev => prev + totalPoints);
      setLastScoreChange({ 
        type: 'win', 
        amount: totalPoints, 
        base: baseReward, 
        bonus: efficiencyBonus, 
        cluesUsed 
      });

      setSuspectModal({
        show: true,
        title: "CASE CRACKED!",
        message: `You correctly identified ${suspectName} as the killer. Your meticulous work has paid off, Detective.`,
        correct: true
      });
    } else {
      // Defeat Calculation
      const penalty = 25;
      
      setScore(prev => prev - penalty);
      setLastScoreChange({ 
        type: 'loss', 
        amount: penalty 
      });

      setSuspectModal({
        show: true,
        title: "WRONG CALL, DETECTIVE.",
        message: `You targeted ${suspectName}. The evidence doesn't quite line up. Review your notes and try again.`,
        correct: false
      });
    }
  };

  const restartGame = () => {
    setVisitedLocations([]);
    setRevealedClues([]); 
    setSuspectModal({ show: false, title: '', message: '', correct: false });
    setEvidenceModal({ show: false, data: null });
    setLastScoreChange(null);
    setStage('intro');
    // Fetch a new random case on restart
    fetchGameData();
  };

  // --- DATA HELPERS ---
  const getStageData = (id) => gameData ? gameData.stages.find(s => s.stage_id === id) : null;

  // --- RENDER HELPERS ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IBM+Plex+Mono:wght@300;400;700&display=swap');
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes flyUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes glow { 0% { box-shadow: 0 0 5px #FFAC47; } 50% { box-shadow: 0 0 20px #FFAC47; } 100% { box-shadow: 0 0 5px #FFAC47; } }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .app-container {
      font-family: 'IBM Plex Mono', monospace;
      color: #d0d0d0;
      min-height: 100vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      overflow-x: hidden;
      filter: grayscale(10%) contrast(110%);
      background: #000;
    }

    .background-fixed {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: 0;
      background-size: cover;
      background-position: center;
      transition: background-image 1s ease-in-out;
    }

    .overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%);
      z-index: 1;
      pointer-events: none;
    }

    .content-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h1, h2, h3 {
      font-family: 'Cinzel Decorative', cursive;
      color: #f0f0f0;
      text-shadow: 0 0 10px rgba(0,0,0,0.9);
      margin: 0;
    }

    .title-bar {
      width: 100%;
      padding: 20px 0;
      background-color: rgba(0, 0, 0, 0.7);
      border-bottom: 2px solid #FFAC47;
      text-align: center;
      margin-bottom: 30px;
      animation: flyUp 1s ease-out;
    }
    
    .title-bar h1 { font-size: 2.2em; text-transform: uppercase; }

    .btn {
      background-color: #333;
      color: #f0f0f0;
      padding: 18px 35px;
      border: 3px solid #FFAC47;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 1.2em;
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.3s;
      box-shadow: 4px 4px 0px #000;
      display: inline-block;
      margin-top: 20px;
    }
    .btn:hover {
      background-color: #444;
      color: #FFAC47;
      transform: translateY(-2px);
      box-shadow: 6px 6px 0px #000;
    }

    .container {
      max-width: 1000px;
      width: 90%;
      margin: 0 auto;
      padding-bottom: 50px;
      text-align: center;
      animation: fadeIn 1s ease-out;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-top: 40px;
    }

    .card {
      background-color: rgba(0, 0, 0, 0.8);
      padding: 25px;
      border: 3px solid #FFAC47;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 5px 5px 0px rgba(0,0,0,0.8);
      text-align: left;
      animation: scaleIn 0.5s ease-out;
      animation-fill-mode: both;
    }
    .card:hover { transform: translateY(-3px); background-color: rgba(26, 35, 58, 0.9); }
    .card.visited { border-color: #4CAF50; background-color: rgba(76, 175, 80, 0.1); }
    .card h3 { margin-top: 0; color: #f0f0f0; border-bottom: 1px dashed #555; padding-bottom: 10px; font-size: 1.4em; }
    .card p { margin-bottom: 0; line-height: 1.5; }

    .center-stage {
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      min-height: 100vh; text-align: center;
      width: 100%;
    }
    .main-title { font-size: 3.5em; margin-bottom: 20px; animation: flyUp 1.5s ease-out; }
    .subtitle { max-width: 600px; font-size: 1.1em; margin-bottom: 40px; font-weight: bold; animation: flyUp 1.5s ease-out 0.5s backwards; }
    
    .case-file {
      background: rgba(0,0,0,0.8); padding: 30px;
      border: 1px solid rgba(255,255,255,0.1);
      max-width: 700px; width: 90%; text-align: left; margin-bottom: 30px;
      animation: flyUp 1s ease-out;
    }
    .case-file strong { color: #FFAC47; }
    .case-file h2 { color: #FFAC47; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px; }

    .instruction { background: rgba(255,172,71,0.1); padding: 15px; border: 1px dashed #FFAC47; margin-bottom: 20px; }
    
    .suspect-card { background-color: rgba(0,0,0,0.6); border-color: #666; }
    .suspect-card:hover { border-color: #FFAC47; background-color: rgba(255,172,71,0.2); }
    .fact { font-style: italic; color: #888; font-size: 0.9em; margin-top: 10px; }

    .reveal-box {
      background: rgba(0,0,0,0.9); padding: 40px; border: 3px solid #FFAC47;
      box-shadow: 0 0 30px rgba(255,172,71,0.2); max-width: 800px; width: 90%;
      animation: flyUp 1s ease-out;
    }
    .killer-name { font-size: 2.5em; color: #4CAF50; text-align: center; margin: 30px 0; }
    .evidence-list { text-align: left; list-style: none; padding: 0; }
    .evidence-list li { margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px; }
    
    .score-badge {
      background: rgba(255, 172, 71, 0.2);
      border: 1px solid #FFAC47;
      color: #FFAC47;
      padding: 15px;
      margin: 20px 0;
      text-align: center;
      border-radius: 4px;
    }
    .score-detail {
      font-size: 0.9em;
      color: #aaa;
      margin-top: 5px;
    }

    .loader {
      border: 5px solid rgba(255, 255, 255, 0.1);
      border-top: 5px solid #FFAC47;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    /* MODALS & CLUE BOXES */
    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.95); z-index: 100;
      display: flex; justify-content: center; align-items: center;
      animation: fadeIn 0.3s ease-out;
    }
    .modal-content {
      background: rgba(26, 35, 58, 0.95); padding: 40px; border: 3px solid #FFAC47;
      width: 80%; max-width: 600px; position: relative; box-shadow: 0 0 40px #FFAC4733;
      max-height: 90vh; overflow-y: auto;
      animation: scaleIn 0.3s ease-out;
    }
    .close-btn { float: right; font-size: 28px; cursor: pointer; color: #FFAC47; }
    
    .clue-list { list-style: none; padding: 0; margin-top: 20px; }
    .clue-item {
      background: rgba(0, 0, 0, 0.6);
      margin-bottom: 15px;
      border: 1px solid #444;
      padding: 15px;
      transition: all 0.3s;
      min-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .clue-item.hidden {
      cursor: pointer;
      background: repeating-linear-gradient(
        45deg,
        #3d3d3d,
        #3d3d3d 10px,
        #4a4a4a 10px,
        #4a4a4a 20px
      );
      border: 2px dashed #FFAC47;
      color: #fff;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      animation: glow 3s infinite;
    }
    .clue-item.hidden:hover {
      background: #FFAC47;
      color: #000;
      border-style: solid;
    }
    .clue-item.revealed {
      background: rgba(0,0,0,0.8);
      border-left: 4px solid #4CAF50;
      justify-content: flex-start;
      text-align: left;
      animation: fadeIn 0.5s;
    }
    
    .feedback-content { background: #3A1A1A; border-color: #FF3333; text-align: center; }
    .feedback-content h2 { color: #FF3333; }
    .feedback-content.correct { background: #1A3A1A; border-color: #4CAF50; }
    .feedback-content.correct h2 { color: #4CAF50; }

    @media (max-width: 600px) {
      .main-title { font-size: 2em; }
      .btn { padding: 15px 25px; font-size: 1em; }
    }
  `;

  // --- LOADING / ERROR STATES ---
  if (loading) return (
    <div className="app-container">
      <style>{styles}</style>
      <div className="center-stage">
        <div className="loader"></div>
        <h2 style={{color: '#FFAC47'}}>Fetching Case Files...</h2>
      </div>
    </div>
  );

  if (error) return (
    <div className="app-container">
      <style>{styles}</style>
      <div className="center-stage">
        <h2 style={{color: '#FF3333', marginBottom: '20px'}}>Connection Failed</h2>
        <p style={{maxWidth: '500px', marginBottom: '30px'}}>{error}</p>
        <button className="btn" onClick={fetchGameData}>Retry Connection</button>
      </div>
    </div>
  );

  if (!gameData) return null;

  return (
    <div className="app-container">
      <style>{styles}</style>
      
      <div className="background-fixed" style={{ backgroundImage: `url('${getBg()}')` }}></div>
      <div className="overlay"></div>

      <div className="content-wrapper">
        {/* --- INTRO STAGE --- */}
        {stage === 'intro' && (
          <div className="center-stage">
            <h1 className="main-title">Case:Zero</h1>
            <h2 style={{fontSize: '1.8em', marginBottom: '20px', color: '#FFAC47'}}>{gameData.game_title}</h2>
            <p className="subtitle">
              {gameData.theme}
            </p>
            <div style={{color: '#FFAC47', marginBottom: '20px', fontFamily: 'IBM Plex Mono', fontSize: '1.1em'}}>
              Current Rating: {score} (Lead Investigator)
            </div>
            <button className="btn" style={{animation: 'fadeIn 1s ease-out 2s backwards'}} onClick={() => handleSetStage('briefing')}>
              Begin Investigation
            </button>
          </div>
        )}

        {/* --- BRIEFING STAGE --- */}
        {stage === 'briefing' && (() => {
          const briefingData = getStageData('briefing').display_data;
          return (
            <div className="center-stage" style={{ height: 'auto', paddingTop: '50px' }}>
              <div className="title-bar">
                <h1>{briefingData.header}</h1>
              </div>
              <div className="case-file">
                <p>{briefingData.atmosphere_intro}</p>
                <p>{briefingData.partner_dialogue}</p>

                <h3>Initial Clues</h3>
                <ul>
                    <li><strong>Victim:</strong> {briefingData.quick_facts.victim}</li>
                    <li><strong>Cause of Death:</strong> {briefingData.quick_facts.cause_of_death}</li>
                    <li><strong>Initial Clue:</strong> {briefingData.quick_facts.initial_clue}</li>
                    <li><strong>Complication:</strong> {briefingData.quick_facts.complication}</li>
                </ul>
              </div>
              <button className="btn" style={{ marginBottom: '50px' }} onClick={() => handleSetStage('evidence_collection')}>Start Investigation</button>
            </div>
          );
        })()}

        {/* --- INVESTIGATION STAGE --- */}
        {stage === 'evidence_collection' && (() => {
           const evidenceStage = getStageData('evidence_collection');
           return (
            <div className="container" style={{ marginTop: '50px' }}>
              <div className="title-bar">
                <h1>Stage 2: Evidence Collection 🔎</h1>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '1.2em', color: '#FFAC47', fontWeight: 'bold' }}>
                  LOCATIONS VISITED: {visitedLocations.length} 📍
                </div>
                <div style={{ fontSize: '1.2em', color: '#FFAC47', fontWeight: 'bold' }}>
                  CLUES EXAMINED: {revealedClues.length} 🔍
                </div>
                <button className="btn" style={{ marginTop: 0, padding: '12px 20px', fontSize: '1em' }} onClick={() => handleSetStage('suspect_interrogation')}>
                  Proceed to Suspects 🤔
                </button>
              </div>

              <p className="instruction">{evidenceStage.description}</p>
              
              <div className="grid">
                {evidenceStage.locations.map((loc, i) => (
                  <div 
                    key={loc.id}
                    className={`card ${visitedLocations.includes(loc.id) ? 'visited' : ''}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    onClick={() => openEvidence(loc)}
                  >
                    <h3>{loc.name}</h3>
                    <p>{loc.description.substring(0, 60)}...</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* --- SUSPECTS STAGE --- */}
        {stage === 'suspect_interrogation' && (() => {
          const suspectStage = getStageData('suspect_interrogation');
          return (
            <div className="container" style={{ marginTop: '50px' }}>
              <div className="title-bar">
                <h1>Stage 3: {suspectStage.objective}</h1>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '1.2em', color: '#FFAC47', fontWeight: 'bold' }}>
                  LOCATIONS VISITED: {visitedLocations.length} 📍
                </div>
                <div style={{ fontSize: '1.2em', color: '#FFAC47', fontWeight: 'bold' }}>
                  CLUES EXAMINED: {revealedClues.length} 🔍
                </div>
              </div>

              <p className="instruction">Review your findings and accuse the killer.</p>

              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <button className="btn" style={{ padding: '12px 25px', fontSize: '1em' }} onClick={() => handleSetStage('evidence_collection')}>
                  ← Back to Investigation
                </button>
              </div>

              <div className="grid">
                {suspectStage.suspect_list.map((suspect, i) => (
                  <div 
                    key={i}
                    className="card suspect-card"
                    style={{ animationDelay: `${i * 0.2}s` }}
                    onClick={() => selectSuspect(suspect.name)}
                  >
                    <h3>{suspect.name}</h3>
                    <p><strong>Motive:</strong> {suspect.motive}</p>
                    <p className="fact">Fact: {suspect.supporting_fact}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* --- REVEAL STAGE --- */}
        {stage === 'conclusion' && (() => {
          const conclusionData = getStageData('conclusion').solution_details;
          return (
            <div className="center-stage" style={{ height: 'auto', paddingTop: '50px' }}>
              <div className="title-bar">
                <h1>The Conclusion</h1>
              </div>
              <div className="reveal-box">
                <div style={{ fontStyle: 'italic', marginBottom: '20px', textAlign: 'center' }}>"Success. The truth always surfaces eventually."</div>
                
                <div style={{ margin: '20px 0', fontSize: '1.5em', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <span title="Locations Visited">{Array(visitedLocations.length).fill('📍').join('')}</span>
                  <span title="Clues Found">{Array(revealedClues.length).fill('🔎').join('')}</span>
                </div>

                <div className="score-badge">
                  <div style={{fontSize: '1.3em', fontWeight: 'bold'}}>🛡️ Rank: Lead Investigator</div>
                  <div style={{fontSize: '1.5em', margin: '10px 0'}}>Final Rating: {score}</div>
                  {lastScoreChange && lastScoreChange.type === 'win' && (
                    <div className="score-detail">
                      <div>Base Reward: +{lastScoreChange.base}</div>
                      <div>Efficiency Bonus: +{lastScoreChange.bonus} ({lastScoreChange.cluesUsed} clues used)</div>
                      <div style={{color: '#4CAF50', fontWeight: 'bold'}}>Total Earned: +{lastScoreChange.amount}</div>
                    </div>
                  )}
                </div>

                <div className="killer-name">THE KILLER IS: {conclusionData.killer.toUpperCase()}</div>
                
                <h3>Motive</h3>
                <p style={{ textAlign: 'center', marginBottom: '20px' }}>{conclusionData.motive}</p>
                
                <h3>Evidence Correlation</h3>
                <ul className="evidence-list">
                  {conclusionData.evidence_correlation.map((item, index) => (
                    <li key={index}>
                      <strong>{item.clue}</strong><br/>
                      <span style={{color: '#aaa', display: 'block', marginTop: '5px'}}>⤷ {item.explanation}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: '40px', fontSize: '1.2em', textAlign: 'center', color: '#ddd' }}>
                  <i>The city sleeps a little sounder tonight, Detective.</i> 🕵️‍♂️
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <button className="btn" onClick={restartGame}>Start New Case</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* --- EVIDENCE MODAL --- */}
      {evidenceModal.show && (
        <div className="modal-backdrop" onClick={() => setEvidenceModal({ show: false, data: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setEvidenceModal({ show: false, data: null })}>&times;</span>
            <h2 style={{ color: '#FFAC47' }}>{evidenceModal.data.name}</h2>
            <p>{evidenceModal.data.description}</p>
            <h3 style={{ marginTop: '20px', color: '#FFAC47' }}>Findings</h3>
            <ul className="clue-list">
              {evidenceModal.data.findings.map((finding, idx) => {
                const clueId = `${evidenceModal.data.id}-${idx}`;
                const isRevealed = revealedClues.includes(clueId);
                return (
                  <li 
                    key={idx} 
                    onClick={() => handleRevealClue(evidenceModal.data.id, idx)}
                    className={`clue-item ${isRevealed ? 'revealed' : 'hidden'}`}
                  >
                    {isRevealed ? (
                      <span dangerouslySetInnerHTML={{ __html: finding }} />
                    ) : (
                      <span>📦 Click to Reveal Evidence</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* --- SUSPECT MODAL --- */}
      {suspectModal.show && (
        <div className="modal-backdrop" onClick={() => !suspectModal.correct && setSuspectModal({ ...suspectModal, show: false })}>
          <div className={`modal-content feedback-content ${suspectModal.correct ? 'correct' : ''}`} onClick={(e) => e.stopPropagation()}>
            <h2>{suspectModal.title}</h2>
            <p>{suspectModal.message}</p>
            
            {!suspectModal.correct && (
              <div style={{margin: '15px 0', color: '#FF3333'}}>
                <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>RATING PENALTY: -25</div>
                <div>Current Rating: {score}</div>
              </div>
            )}

            {suspectModal.correct ? (
              <button className="btn" onClick={() => { setSuspectModal({ ...suspectModal, show: false }); handleSetStage('conclusion'); }}>View Conclusion</button>
            ) : (
              <button className="btn" onClick={() => setSuspectModal({ ...suspectModal, show: false })}>Try Again</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}