import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- FALLBACK DATA ---
// Used directly here since the Vite proxy is not available in this environment.
const FALLBACK_GAME_DATA = {
  "gameData": {
    "game_title": "The Velvet Curtain",
    "theme": "Film Noir",
    "stages": [
      {
        "stage_order": 1,
        "stage_id": "briefing",
        "display_data": {
          "header": "Case Briefing: Vincent Mallory",
          "atmosphere_intro": "🌧️ Rain hammers the neon-lit streets. Smoke curls from your cigarette. Another body. Another secret. 🕵️",
          "partner_dialogue": "Detective, we got a dead jazz club owner—Vincent Mallory, shot once through the heart at The Velvet Room. Found him in his office at 2 AM. Here's the kicker: his safe was open, but nothing was taken. This wasn't about money, pal.",
          "quick_facts": {
            "victim": "Vincent Mallory, Jazz Club Owner 🎷",
            "cause_of_death": "Single gunshot wound to the chest, .38 caliber 🔫",
            "initial_clue": "A crimson lipstick-stained cigarette butt near the body 💋",
            "complication": "Four people had keys to his office. All were in the building that night. No witnesses. 🔑"
          }
        }
      },
      {
        "stage_order": 2,
        "stage_id": "evidence_collection",
        "description": "The player visits four specific locations to gather findings.",
        "locations": [
          {
            "id": "loc_1_office",
            "name": "Mallory's Office",
            "description": "A cramped room reeking of bourbon and cigars, papers scattered everywhere.",
            "findings": [
              {
                "teaser": "Something hidden in the desk drawer...",
                "clue": "A threatening letter: 'Pay up or I'll tell everyone about your side business.' Unsigned. 📝"
              },
              {
                "teaser": "An odd detail about the safe...",
                "clue": "The safe dial shows fresh fingerprints in grey powder—someone wore cotton gloves. 🧤"
              },
              {
                "teaser": "Financial records in disarray...",
                "clue": "Ledger pages showing discrepancies in club accounts, with Rita Chen's handwriting in the margins. 📊"
              }
            ]
          },
          {
            "id": "loc_2_backstage",
            "name": "Backstage Dressing Room",
            "description": "Vanity mirrors lined with bulbs, costumes hanging like ghosts in the shadows.",
            "findings": [
              {
                "teaser": "A performer's personal item...",
                "clue": "Scarlett's makeup kit contains the same crimson lipstick shade found at the scene. 💄"
              },
              {
                "teaser": "A discarded piece of clothing...",
                "clue": "A grey cotton work glove stuffed behind a radiator, smelling of gun oil—the type Rita wears for handling financial documents. 🧤"
              }
            ]
          },
          {
            "id": "loc_3_bar",
            "name": "The Main Bar",
            "description": "Chrome and leather stools, empty glasses catching the dim overhead lights.",
            "findings": [
              {
                "teaser": "The bartender's secret stash...",
                "clue": "Frank's locker contains a .38 revolver with two rounds missing from the chamber. 🔫"
              },
              {
                "teaser": "Evidence of a transaction...",
                "clue": "A receipt showing Frank paid off a $5,000 debt to Mallory three days ago. 💵"
              }
            ]
          },
          {
            "id": "loc_4_alley",
            "name": "Back Alley Exit",
            "description": "Trash cans overflow. A single bulb flickers above the service door.",
            "findings": [
              {
                "teaser": "Fresh tracks in the rain...",
                "clue": "Muddy footprints, size 9 men's dress shoes, lead from the exit to a storm drain. 👞"
              },
              {
                "teaser": "Something disposed of hastily...",
                "clue": "In the drain: a monogrammed handkerchief with initials 'R.C.' and gunpowder residue. 🔍"
              }
            ]
          }
        ]
      },
      {
        "stage_order": 3,
        "stage_id": "suspect_interrogation",
        "objective": "Choose the killer based on Motive, Means, and Opportunity.",
        "correct_suspect": "Rita Chen",
        "suspect_list": [
          {
            "name": "Scarlett Divine",
            "motive": "The star singer, having an affair with Mallory who promised to leave his wife but kept stalling.",
            "supporting_fact": "Her crimson lipstick matches the cigarette butt found by the body. She admits to being in his office earlier that evening for a heated argument. 💋"
          },
          {
            "name": "Frank Delano",
            "motive": "The bartender who owed Mallory money and was being pressured for additional payments.",
            "supporting_fact": "His .38 revolver is missing two bullets, same caliber as the murder weapon. He claims he fired them at rats in the alley last week, but has no witnesses. 🔫"
          },
          {
            "name": "Rita Chen",
            "motive": "The accountant who discovered Mallory was skimming from the club to pay gambling debts, then he discovered she was embezzling to support her sick mother.",
            "supporting_fact": "Her monogrammed handkerchief with gunpowder residue was found in the alley drain. Grey cotton gloves she uses for work were found backstage with gun oil. 🔍"
          },
          {
            "name": "Tommy Rizzo",
            "motive": "The stage manager fired by Mallory last week for stealing liquor inventory, threatened to ruin his reputation.",
            "supporting_fact": "His size 9 dress shoes match muddy prints leading from the back exit. He admits he was in the building that night collecting his final paycheck. 👞"
          }
        ]
      },
      {
        "stage_order": 4,
        "stage_id": "conclusion",
        "title": "The Conclusion",
        "outcome": "Success (Case Closed)",
        "solution_details": {
          "killer": "Rita Chen",
          "motive": "Mallory discovered Rita was embezzling to support her sick mother. He threatened to expose her unless she helped him cook the books further to hide his own gambling debts. Desperate and cornered, Rita decided to silence him permanently.",
          "evidence_correlation": [
            {
              "clue": "Monogrammed handkerchief 'R.C.' with gunpowder residue in the storm drain. 🔍",
              "explanation": "Rita disposed of evidence linking her to the shooting immediately after leaving the back exit."
            },
            {
              "clue": "Grey cotton gloves with gun oil found backstage. 🧤",
              "explanation": "These match the grey powder prints on the safe and explain the lack of fingerprints on the gun."
            },
            {
              "clue": "Discrepancies in the ledger with Rita's handwriting. 📊",
              "explanation": "Provides the motive for the confrontation—financial crimes that were about to be exposed."
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
  const [clueBoardOpen, setClueBoardOpen] = useState(false); // NEW STATE FOR CLUE BOARD
  const [suspectModal, setSuspectModal] = useState({ 
    show: false, 
    title: '', 
    message: '', 
    correct: false,
    isGameOver: false 
  });

  // Background Image Logic
  const MZ_IMG_INTRO = 'https://i.imgur.com/G3cLxS8.gif';
  const MZ_IMG_BRIEFING = 'https://i.imgur.com/iqioKnE.gif';
  const MZ_IMG_INVESTIGATION = 'https://i.imgur.com/MHfLJSY.png';
  const MZ_IMG_SUSPECTS = 'https://i.imgur.com/aMU7nyM.gif';
  
  // --- API FETCH (MOCKED FOR PREVIEW) ---
  const fetchGameData = async () => {
    setLoading(true);
    setError(null);
    try {
      // UPDATED FETCH: Uses local proxy path "/api" instead of full URL
      // This routes through vite.config.js to avoid CORS errors
      const response = await fetch('/api/games/random', {
        method: 'GET',
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY
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
        correct: true,
        isGameOver: false
      });
    } else {
      // Defeat Calculation (GAME OVER)
      const penalty = 50;
      
      setScore(prev => Math.max(0, prev - penalty)); // Prevent negative score for visual cleanliness
      setLastScoreChange({ 
        type: 'loss', 
        amount: penalty 
      });

      setSuspectModal({
        show: true,
        title: "CASE FAILED",
        message: `You accused ${suspectName}, but they had a solid alibi. While you were distracted, the real killer slipped out of the city. The case has gone cold.`,
        correct: false,
        isGameOver: true // Marks this as a fatal state
      });
    }
  };

  const restartGame = () => {
    setScore(1500); // Reset score on restart
    setVisitedLocations([]);
    setRevealedClues([]); 
    setSuspectModal({ show: false, title: '', message: '', correct: false, isGameOver: false });
    setEvidenceModal({ show: false, data: null });
    setClueBoardOpen(false);
    setLastScoreChange(null);
    setStage('intro');
    // Fetch a new random case on restart
    fetchGameData();
  };

  // --- DATA HELPERS ---
  const getStageData = (id) => gameData ? gameData.stages.find(s => s.stage_id === id) : null;

  return (
    <div className="app-container">
      <style>{`
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
        
        /* --- CLUE BOARD SPECIFIC STYLES --- */
        .clue-board-modal {
          background-color: #463428; /* Dark wood/cork base */
          background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px);
          border: 10px solid #2a1d15;
          box-shadow: inset 0 0 40px #000, 0 10px 30px #000;
          max-width: 900px !important;
          width: 95% !important;
          border-radius: 4px;
        }
        
        .board-title {
          font-family: 'Cinzel Decorative', cursive;
          color: #e0c097;
          border-bottom: 2px solid #8d6e63;
          padding-bottom: 10px;
          margin-bottom: 30px;
          text-shadow: 2px 2px 0px #000;
          text-align: center;
        }

        .board-section-title {
          background: #eee;
          color: #222;
          display: inline-block;
          padding: 8px 15px;
          transform: rotate(-2deg);
          box-shadow: 3px 3px 5px rgba(0,0,0,0.5);
          margin-bottom: 20px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: bold;
          font-size: 1.1em;
          border: 1px solid #ccc;
        }

        .board-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px; 
          padding: 20px;
          padding-bottom: 40px;
          align-items: start;
        }

        /* Responsive Breakpoint for 2 columns */
        @media (min-width: 768px) {
          .board-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .pinned-note {
          background: #fdf5e6; /* Old Lace paper color */
          color: #222;
          padding: 20px;
          font-family: 'IBM Plex Mono', monospace;
          box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
          position: relative;
          transition: transform 0.2s;
          border: 1px solid #d7ccc8;
          width: auto; /* Grid handles width */
          min-height: 100px;
          font-size: 0.9em;
        }
        
        /* Pin Graphic Pseudo-element */
        .pinned-note::after {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d32f2f; /* Red pin */
          box-shadow: 2px 2px 3px rgba(0,0,0,0.4);
          z-index: 2;
        }
        
        /* Pin "shadow" on paper */
        .pinned-note::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          z-index: 1;
        }

        /* Messy Rotation Effects */
        .pinned-note:nth-child(odd) { transform: rotate(1.5deg); }
        .pinned-note:nth-child(even) { transform: rotate(-1deg); }
        .pinned-note:nth-child(3n) { transform: rotate(2deg); }
        .pinned-note:hover { transform: scale(1.02) rotate(0deg); z-index: 10; box-shadow: 10px 10px 20px rgba(0,0,0,0.4); }

        .clue-board-modal .close-btn { 
          color: #e0c097; 
          text-shadow: 1px 1px 0 #000;
          opacity: 0.8;
        }
        .clue-board-modal .close-btn:hover { opacity: 1; }

        @media (max-width: 600px) {
          .pinned-note { width: 100%; transform: none !important; }
          .clue-board-modal { padding: 15px; }
          .board-grid { gap: 20px; padding: 10px; }
        }

        /* --- END CLUE BOARD STYLES --- */
        
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
      `}</style>
      
      {/* LOADING / ERROR STATES */}
      {loading ? (
        <div className="center-stage">
          <div className="loader"></div>
          <h2 style={{color: '#FFAC47'}}>Fetching Case Files...</h2>
        </div>
      ) : error ? (
        <div className="center-stage">
          <h2 style={{color: '#FF3333', marginBottom: '20px'}}>Connection Failed</h2>
          <p style={{maxWidth: '500px', marginBottom: '30px'}}>{error}</p>
          <button className="btn" onClick={fetchGameData}>Retry Connection</button>
        </div>
      ) : (
        <>
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
                    
                    {/* NEW CLUE BOARD BUTTON */}
                    <button 
                      className="btn" 
                      style={{ marginTop: 0, padding: '12px 20px', fontSize: '1em', borderColor: '#4CAF50', color: '#4CAF50' }} 
                      onClick={() => setClueBoardOpen(true)}
                    >
                      📋 Review Clues
                    </button>

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

                  <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn" style={{ padding: '12px 25px', fontSize: '1em' }} onClick={() => handleSetStage('evidence_collection')}>
                      ← Back to Investigation
                    </button>
                    
                    <button 
                      className="btn" 
                      style={{ padding: '12px 20px', fontSize: '1em', borderColor: '#4CAF50', color: '#4CAF50' }} 
                      onClick={() => setClueBoardOpen(true)}
                    >
                      📋 Review Clues
                    </button>
                  </div>

                  <p className="instruction">Review your findings and accuse the killer.</p>

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
                        {/* Removed the 'Fact' line as requested */}
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
                    
                    const clueText = finding.clue;
                    const teaserText = finding.teaser;

                    return (
                      <li 
                        key={idx} 
                        onClick={() => handleRevealClue(evidenceModal.data.id, idx)}
                        className={`clue-item ${isRevealed ? 'revealed' : 'hidden'}`}
                      >
                        {isRevealed ? (
                          <span dangerouslySetInnerHTML={{ __html: clueText }} />
                        ) : (
                          <span>📦 {teaserText}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

           {/* --- NEW: CLUE BOARD MODAL --- */}
           {clueBoardOpen && (
            <div className="modal-backdrop" onClick={() => setClueBoardOpen(false)}>
              {/* Added 'clue-board-modal' class for specific corkboard styling */}
              <div className="modal-content clue-board-modal" onClick={(e) => e.stopPropagation()}>
                <span className="close-btn" onClick={() => setClueBoardOpen(false)}>&times;</span>
                <h2 className="board-title">Detective's Notebook</h2>
                
                <div style={{ textAlign: 'left' }}>
                  <div className="board-section-title">INITIAL FACTS</div>
                  <div className="board-grid">
                    {(() => {
                       const briefing = getStageData('briefing').display_data.quick_facts;
                       return Object.entries(briefing).map(([key, val], i) => (
                         <div key={i} className="pinned-note">
                           <strong>{key.replace(/_/g, ' ').toUpperCase()}: </strong>
                           <div style={{marginTop: '5px'}}>{val}</div>
                         </div>
                       ));
                    })()}
                  </div>

                  <div className="board-section-title">COLLECTED EVIDENCE</div>
                  <div className="board-grid">
                  {revealedClues.length === 0 ? (
                     <div style={{ fontStyle: 'italic', color: '#e0c097', padding: '10px' }}>No evidence collected yet.</div>
                  ) : (
                      revealedClues.map((rc, i) => {
                         // Robust splitting to handle ids with dashes
                         const parts = rc.split('-');
                         const clueIdx = parts.pop();
                         const locId = parts.join('-');

                         const loc = getStageData('evidence_collection').locations.find(l => l.id === locId);
                         const finding = loc.findings[parseInt(clueIdx)];
                         return (
                           <div key={i} className="pinned-note">
                             <div style={{ fontSize: '0.8em', color: '#666', marginBottom: '5px', textTransform: 'uppercase', borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>
                               📍 {loc.name}
                             </div>
                             <span dangerouslySetInnerHTML={{ __html: finding.clue }} />
                           </div>
                         );
                      })
                  )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- SUSPECT MODAL --- */}
          {suspectModal.show && (
            <div 
              className="modal-backdrop" 
              onClick={() => {
                if (!suspectModal.isGameOver) {
                  setSuspectModal({ ...suspectModal, show: false });
                }
              }}
            >
              <div className={`modal-content feedback-content ${suspectModal.correct ? 'correct' : ''}`} onClick={(e) => e.stopPropagation()}>
                <h2>{suspectModal.title}</h2>
                <p>{suspectModal.message}</p>
                
                {!suspectModal.correct && (
                  <div style={{margin: '15px 0', color: '#FF3333'}}>
                    <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>RATING PENALTY: -50</div>
                    <div>Final Rating: {score}</div>
                    {suspectModal.isGameOver && <div style={{marginTop: '10px', fontStyle: 'italic', color: '#aaa'}}>The case remains unsolved.</div>}
                  </div>
                )}

                {suspectModal.correct ? (
                  <button className="btn" onClick={() => { setSuspectModal({ ...suspectModal, show: false }); handleSetStage('conclusion'); }}>View Conclusion</button>
                ) : (
                  <button className="btn" onClick={restartGame}>Turn in Badge (Restart)</button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}