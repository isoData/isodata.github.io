import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- DATA CONSTANTS ---
const locationsData = [
  {
    id: 'penthouse',
    title: "Crime Scene (Thorne's Penthouse) 🔎",
    setting: "Thorne kept a clean house, but the best lies are tucked just out of sight. You run your hand over the dead man's opulent veneer, looking for the cracks.",
    findings: [
      "Front door lock is intact; no signs of <i>forced entry</i> 🚪.",
      "A <i>half-burnt matchbook</i> from 'The Velvet Shadow' found under the desk 🔥.",
      "Photo of Thorne and a young woman with a note: 'Thanks for the insurance. – C.' 📸"
    ]
  },
  {
    id: 'precinct',
    title: "Police Precinct (Homicide Desk) 🚨",
    setting: "Murphy gives you 5 minutes with the file. The air smells of stale coffee and desperation.",
    findings: [
      "Thorne had a huge <i>gambling debt</i> to private lender Evelyn Reed 📄.",
      "Police Report: Thorne recently called in a disturbance regarding a <i>'stalker'</i> watching his apartment 👀."
    ]
  },
  {
    id: 'newspaper',
    title: "Newspaper Office (City Desk) 📰",
    setting: "Smelly, chaotic city desk. Reporter Jackie Miller talks fast, eyes always on the next headline.",
    findings: [
      "Thorne publicly argued with rival Sal Ricci over stolen funds last week 😡.",
      "Sal Ricci appeared wealthy with <i>new gold cufflinks</i> the morning after the murder ✨."
    ]
  },
  {
    id: 'bar',
    title: "Dingy Bar (The Velvet Shadow) 🥃",
    setting: "The bartender Gus polishes the same glass, remembering every cheap secret traded across his counter.",
    findings: [
      "Thorne gave Clara (coat-check girl) a <i>silver necklace and matching earrings</i> 🎁.",
      "Clara's ex, Mickey, is a <i>heavy smoker</i> who was seen aggressively demanding Clara's new jewelry 🚬."
    ]
  },
  {
    id: 'garage',
    title: "Underground Parking Garage 🚗",
    setting: "The fluorescent lights hum and flicker. Thorne’s car sits in the corner, a shrine to urban violence in the concrete quiet.",
    findings: [
      "Thorne's windshield is smashed with a brick wrapped in a note: <i>'Tick Tock - V.'</i> 🧱.",
      "Parking attendant log: A <i>beat-up, rusted sedan</i> was seen idling across the street every night this week 🚘."
    ]
  },
  {
    id: 'pawn_shop',
    title: "Lucky's Pawn Shop ♟️",
    setting: "A graveyard of lost hopes. Ticking clocks cover the walls, counting down seconds that don't matter anymore.",
    findings: [
      "Ledger: Thorne <i>pawned his Rolex</i> three days ago ⌚.",
      "Shopkeeper testimony: Sold a cheap, second-hand <i>.22 caliber pistol</i> yesterday to a 'twitchy guy in a greaser jacket' 🔫."
    ]
  }
];

const suspectsData = [
  { name: "Vito 'The Hammer' Moretti", motive: "Silence a witness.",kq: "mob", fact: "Pro hit, silenced gun fits the MO for a mob execution." },
  { name: "Sal 'The Quick' Ricci", motive: "Stolen money revenge.", kq: "money", fact: "Fought with Thorne, suddenly appeared wealthy." },
  { name: "Ms. Evelyn Reed", motive: "Huge debt collection.", kq: "debt", fact: "Private lender with potential connections to enforce payment violently." },
  { name: "Mickey", motive: "Jealousy/Control.", kq: "passion", fact: "Quiet killer, obsessed with the necklace/Clara. The jewelry is the key." }
];

const CORRECT_KILLER = 'Mickey';

export default function App() {
  // --- STATE ---
  const [stage, setStage] = useState('intro'); // 'intro', 'briefing', 'investigation', 'suspects', 'reveal'
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
  
  const getBg = () => {
    switch(stage) {
      case 'intro': return MZ_IMG_INTRO;
      case 'briefing': return MZ_IMG_BRIEFING;
      case 'investigation': return MZ_IMG_INVESTIGATION;
      case 'suspects': return MZ_IMG_SUSPECTS;
      case 'reveal': return MZ_IMG_BRIEFING;
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
        message: `You targeted ${suspectName}. The evidence doesn't quite line up. Thorne's last clue points elsewhere. Review the evidence and try again.`,
        correct: false
      });
    }
  };

  const restartGame = () => {
    setVisitedLocations([]);
    setRevealedClues([]); // Only reset clues on full game restart
    setSuspectModal({ show: false, title: '', message: '', correct: false });
    setEvidenceModal({ show: false, data: null });
    setLastScoreChange(null);
    setStage('intro');
  };

  // --- RENDER HELPERS ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IBM+Plex+Mono:wght@300;400;700&display=swap');
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes flyUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes glow { 0% { box-shadow: 0 0 5px #FFAC47; } 50% { box-shadow: 0 0 20px #FFAC47; } 100% { box-shadow: 0 0 5px #FFAC47; } }

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
            <p className="subtitle">
              In the city's shadowed alleys, every whisper hides a lie, every silhouette a secret. Today's case awaits, detective.
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
        {stage === 'briefing' && (
          <div className="center-stage" style={{ height: 'auto', paddingTop: '50px' }}>
            <div className="title-bar">
              <h1>The Case of the Silver Serpent 🕵️</h1>
            </div>
            <div className="case-file">
              <h2>Case Briefing: Elias Thorne</h2>
              <p>The <i>Rain 🌧️ </i>is a cruel curtain over the city. Detective Murphy from Homicide is sitting opposite you.</p>
              <p>"The victim is <i>Elias 'The Serpent' 🐍 Thorne</i>. Mob bookie. Found him in his penthouse. One shot, clean and quiet. Looks professional, but his safe is untouched. The only thing we found? He was clutching a sliver of broken metal: a <i>silver earring 👂</i>."</p>

              <h3>Initial Clues</h3>
              <ul>
                  <li><strong>Victim:</strong> Elias 'The Serpent' Thorne 🐍</li>
                  <li><strong>Cause of Death:</strong> Single, silenced shot 🔫</li>
                  <li><strong>Initial Clue:</strong> A broken silver earring 👂</li>
                  <li><strong>Complication:</strong> Thorne was set to betray Vito 'The Hammer' Moretti 🔨</li>
              </ul>
            </div>
            <button className="btn" style={{ marginBottom: '50px' }} onClick={() => handleSetStage('investigation')}>Start Investigation</button>
          </div>
        )}

        {/* --- INVESTIGATION STAGE --- */}
        {stage === 'investigation' && (
          <div className="container" style={{ marginTop: '50px' }}>
            <div className="title-bar">
              <h1>Stage 2: Evidence Collection 🔎</h1>
            </div>
            
            {/* Added Counter and Button Container */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '1.2em', color: '#FFAC47', fontWeight: 'bold' }}>
                LOCATIONS VISITED: {visitedLocations.length} 📍
              </div>
              <div style={{ fontSize: '1.2em', color: '#FFAC47', fontWeight: 'bold' }}>
                CLUES EXAMINED: {revealedClues.length} 🔍
              </div>
              <button className="btn" style={{ marginTop: 0, padding: '12px 20px', fontSize: '1em' }} onClick={() => handleSetStage('suspects')}>
                Proceed to Suspects 🤔
              </button>
            </div>

            <p className="instruction">The city is a puzzle box. Visit these locations to find the clues.</p>
            
            <div className="grid">
              {locationsData.map((loc, i) => (
                <div 
                  key={loc.id}
                  className={`card ${visitedLocations.includes(loc.id) ? 'visited' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => openEvidence(loc)}
                >
                  <h3>{loc.title}</h3>
                  <p>{loc.setting.substring(0, 60)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SUSPECTS STAGE --- */}
        {stage === 'suspects' && (
          <div className="container" style={{ marginTop: '50px' }}>
            <div className="title-bar">
              <h1>Stage 3: The Suspects 👥</h1>
            </div>

            {/* Counters added here */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '1.2em', color: '#FFAC47', fontWeight: 'bold' }}>
                LOCATIONS VISITED: {visitedLocations.length} 📍
              </div>
              <div style={{ fontSize: '1.2em', color: '#FFAC47', fontWeight: 'bold' }}>
                CLUES EXAMINED: {revealedClues.length} 🔍
              </div>
            </div>

            <p className="instruction">Time to choose the killer based on Motive, Means, and Opportunity.</p>

            {/* Back Button */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <button className="btn" style={{ padding: '12px 25px', fontSize: '1em' }} onClick={() => handleSetStage('investigation')}>
                ← Back to Investigation
              </button>
            </div>

            <div className="grid">
              {suspectsData.map((suspect, i) => (
                <div 
                  key={i}
                  className="card suspect-card"
                  style={{ animationDelay: `${i * 0.2}s` }}
                  onClick={() => selectSuspect(suspect.name)}
                >
                  <h3>{suspect.name}</h3>
                  <p><strong>Motive:</strong> {suspect.motive}</p>
                  <p className="fact">Fact: {suspect.fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- REVEAL STAGE --- */}
        {stage === 'reveal' && (
          <div className="center-stage" style={{ height: 'auto', paddingTop: '50px' }}>
            <div className="title-bar">
              <h1>The Conclusion</h1>
            </div>
            <div className="reveal-box">
              <div style={{ fontStyle: 'italic', marginBottom: '20px', textAlign: 'center' }}>"Success. The truth always surfaces eventually."</div>
              
              {/* Investigation Stats Moved Here */}
              <div style={{ margin: '20px 0', fontSize: '1.5em', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                 <span title="Locations Visited">{Array(visitedLocations.length).fill('📍').join('')}</span>
                 <span title="Clues Found">{Array(revealedClues.length).fill('🔎').join('')}</span>
              </div>

              {/* MISSION REPORT (Rank & Score) */}
              <div className="score-badge">
                <div style={{fontSize: '1.3em', fontWeight: 'bold'}}>🛡️ Rank: Lead Investigator</div>
                <div style={{fontSize: '1.5em', margin: '10px 0'}}>Current Rating: {score}</div>
                {lastScoreChange && lastScoreChange.type === 'win' && (
                  <div className="score-detail">
                    <div>Base Reward: +{lastScoreChange.base}</div>
                    <div>Efficiency Bonus: +{lastScoreChange.bonus} ({lastScoreChange.cluesUsed} clues used)</div>
                    <div style={{color: '#4CAF50', fontWeight: 'bold'}}>Total Earned: +{lastScoreChange.amount}</div>
                    <div style={{marginTop: '10px', fontSize: '0.8em'}}>Next Rank: Sherlock (at 3000)</div>
                  </div>
                )}
              </div>

              <div className="killer-name">THE KILLER IS: MICKEY</div>
              
              <h3>Motive: Passion and Greed</h3>
              <p style={{ textAlign: 'center', marginBottom: '20px' }}>(Wanted the jewelry/hated Thorne)</p>
              
              <ul className="evidence-list">
                <li><strong>Matchbook:</strong> Places Mickey (smoker) at the scene.</li>
                <li><strong>Earring:</strong> Matches the set Thorne gave Clara.</li>
                <li><strong>No forced entry:</strong> Mickey stole Clara's key.</li>
                <li><strong>Stalker Report:</strong> Confirms Mickey's obsession.</li>
              </ul>

              <div style={{ marginTop: '40px', fontSize: '1.2em', textAlign: 'center', color: '#ddd' }}>
                <i>The city sleeps a little sounder tonight, Detective.</i> 🕵️‍♂️
              </div>

              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button className="btn" onClick={restartGame}>Start New Case</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- EVIDENCE MODAL --- */}
      {evidenceModal.show && (
        <div className="modal-backdrop" onClick={() => setEvidenceModal({ show: false, data: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setEvidenceModal({ show: false, data: null })}>&times;</span>
            <h2 style={{ color: '#FFAC47' }}>{evidenceModal.data.title}</h2>
            <p>{evidenceModal.data.setting}</p>
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
            
            {/* Penalty Feedback */}
            {!suspectModal.correct && (
              <div style={{margin: '15px 0', color: '#FF3333'}}>
                <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>RATING PENALTY: -25</div>
                <div>Current Rating: {score}</div>
              </div>
            )}

            {suspectModal.correct ? (
              <button className="btn" onClick={() => { setSuspectModal({ ...suspectModal, show: false }); handleSetStage('reveal'); }}>View Conclusion</button>
            ) : (
              <button className="btn" onClick={() => setSuspectModal({ ...suspectModal, show: false })}>Try Again</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}