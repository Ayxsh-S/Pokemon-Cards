import { useState, useEffect } from 'react'
import PokemonCard from "./pokemoncard"
import './App.css'

function App() {
  const [list, setList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [flippedMap, setFlippedMap] = useState({});
  const [resetShiny, setResetShiny] = useState(false);
  const [beingFlipped, setBeingFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedCards, setClickedCards] = useState(new Set());
  const [showHelp, setShowHelp] = useState(false);
  const [limit, setLimit] = useState(0);
  const [showMenuScreen, setShowMenuScreen] = useState(true);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);

  useEffect(() => {
    if (limit === 0) return;
    async function fetchRandomPokemon() {
    const total = 1025;
    const randomOffsets = Array.from({ length: limit }, () =>
      Math.floor(Math.random() * total) + 1
    );
    try {
      const details = await Promise.all(
        randomOffsets.map(async (id) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch Pokemon with ID ${id}: ${res.status}`);
          }
          return res.json();
       })
      );
       const pokemonData = details.map((d) => ({
        id: d.id,
        name: d.name,
        img: d.sprites.front_default,
        shinyImg: d.sprites.front_shiny,
        }));
        setOriginalList(pokemonData);
        setList(pokemonData);
    } catch (err) {
      console.error("Error fetching Pokemon:", err);
      setList([]);
    }
   }
   fetchRandomPokemon();
  }, [limit]);

  function shuffleList() {
    return [...originalList].sort(() => Math.random() - 0.5);
  }

  const handleClick = async () => {
    if (beingFlipped) return;
    setBeingFlipped(true);
    setFlipping(true);
    setFlipped(true);
    setResetShiny(prev => !prev)
    setList(shuffleList());
    setTimeout(async () => {
      setFlipped(false);
      setFlipping(false);
      setBeingFlipped(false);
    }, 1700);
  };

  function handleScore(id) {
    setClickedCards(prev => {
      if (prev.has(id)) {
        setScore(0);
        if (score > bestScore) setBestScore(score);
        return new Set();
      } else {
        setScore(s => s + 1);
        const updated = new Set(prev);
        updated.add(id);
        return updated
      }
    });
  }

  function toggleFlip(id) {
    setFlippedMap(prev => ({ ...prev, [id]: !prev[id] }));
  }

  useEffect(() => {
    if (score === limit && limit > 0) setShowWinnerScreen(true);
  }, [score, limit]);

  return (
    <>
    <title>Memory Cards</title>
    {showMenuScreen && (
      <div className="menu-overlay">
        <div className="pokeball-bg"></div>
        <div className="menu-content">
          <h1>Pokémon Cards</h1>
          <div className="button-container">
            <button className="menu-btn easy" onClick={() => {setShowMenuScreen(false); setLimit(4)}}>Easy</button>
            <button className="menu-btn medium" onClick={() => {setShowMenuScreen(false); setLimit(8)}}>Medium</button>
            <button className="menu-btn hard" onClick={() => {setShowMenuScreen(false); setLimit(12)}}>Hard</button>
            <button className="menu-btn extreme" onClick={() => {setShowMenuScreen(false); setLimit(16)}}>Extreme</button>
          </div>
        </div>
      </div>
    )}
    {showWinnerScreen && (
      <div className="winner-overlay">
        <div className="winner-content">
          <h1>Winner!</h1>
          <button className="play-again-btn" onClick={() => {
            setShowWinnerScreen(false);
            setShowMenuScreen(true);
            setScore(0);
            setBestScore(0);
            setClickedCards(new Set());
            setList([]);
            setOriginalList([]);
            setLimit(0);
          }}
          >Play Again?</button>
        </div>
      </div>
    )}
    <div className="container">
      <div className="top-container">
        <div className="help">
          <button className="help-btn" onClick={() => setShowHelp(true)}>?</button>
          <button className="back-btn"
          onClick={() => {
            setShowMenuScreen(true);
            setScore(0);
            setBestScore(0);
            setClickedCards(new Set());
            setList([]);
            setOriginalList([]);
            setLimit(0);
          }}
          >
             ← Go back</button>
        </div>
        <div className="score-container">
          <p>Current score is: {score}</p>
          <p>Highest score is: {bestScore}</p>
        </div>
     </div>
     <div className="gallery">
      {list.map((p) => (
        <PokemonCard
            key={p.id}
            img={p.img}
            shinyImg={p.shinyImg}
            name={p.name}
            flipped={flipped}
            resetShiny={resetShiny}
            disabled={flipping || beingFlipped}
            hoverDisabled={flipping || beingFlipped}
            onClick={() => {
              setFlipped(f => !f);
              handleClick();
              toggleFlip(p.id);
              handleScore(p.id);
            }}
            onAnimationEnd={() => setFlipping(false)}
          />
      ))}
     </div>
     </div>
     {showHelp && (
      <div className="help-modal">
        <div className="help-content">
          <h3>How to Play</h3>
          <p>Click on a card to increase your score</p>
          <p>If you click the same card twice, your score gets reset</p>
          <p>The shiny button shows the shiny version of Pokémon</p>
          <button onClick={() => setShowHelp(false)}>Close</button>
        </div>
      </div>
     )}
    </>
  )
}

export default App

