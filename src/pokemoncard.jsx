import { useRef, useEffect, useState} from "react";

export default function PokemonCard({ img, shinyImg, name, flipped, onClick, animationClass = "", resetShiny, disabled, hoverDisabled }) {
    const cardRef = useRef(null);
    const rafRef = useRef(null);
    const [isShiny, setIsShiny] = useState(false);
    
    useEffect(() => {
      setIsShiny(false);
    }, [resetShiny]);

    function handleMove(e) {
      if (hoverDisabled || flipped) return;
      const el = cardRef.current;
      if (!el) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current= requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (x - 0.5) * 30;
        const ry = (y -  0.5) * -20;

        el.style.setProperty("--rx", rx.toFixed(2));
        el.style.setProperty("--ry", ry.toFixed(2));
        el.style.setProperty("--shineX", (x * 100).toFixed(2) + "%");
        el.style.setProperty("--shineY", (y * 100).toFixed(2) + "%");
        el.style.setProperty("--shineOpacity", "1");
      });
    }
    function handleLeave() {
      if (hoverDisabled || flipped) return;
      const el = cardRef.current;
      if (!el) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.style.setProperty("--rx", "0");
      el.style.setProperty("--ry", "0");
      el.style.setProperty("--shineX", "50%");
      el.style.setProperty("--shineY", "50%");
      el.style.setProperty("--shineOpacity", "0");
    }

    useEffect(() => {
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    useEffect(() => {
      const el = cardRef.current;
      if (!el) return;
      if (flipped) {
        el.style.setProperty("--rx", "0");
        el.style.setProperty("--ry", "0");
        el.style.setProperty("--shineX", "50%");
        el.style.setProperty("--shineY", "50%");
        el.style.setProperty("--shineOpacity", "0");
      }
    }, [flipped]);

    const handleCardClick = () => {
      if (disabled) return;
      onClick?.();
    };

    const displayImg = isShiny && shinyImg ? shinyImg : img;

    return (
        <div
        ref={cardRef}
        className={`pokemon-card ${isShiny ? "shiny" : ""} ${flipped ? "flipped" : ""} ${animationClass}`} 
        onClick={handleCardClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchStart={handleLeave}
        tabIndex={0}
        role="button"
        aria-label={`${name} card`}
        style={{}}
        >
            <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        <div className="card-face card-front">
          <img className="pokemon-card__img" src={displayImg} alt={name} loading="lazy" />
          <div className="pokemon-card__meta">
            <div className="pokemon-card__name">{name}</div>
            <button
              className="pokemon-card__btn"
              onClick={(e) => { e.stopPropagation(); if (shinyImg) setIsShiny(s => !s); }}
            >
              {isShiny ? "Normal" : (shinyImg ? "Shiny" : "No Shiny")}
            </button>
          </div>
        </div>
        <div className="card-face card-back">
          <div className="pokemon-card__name yellow-color">{name}</div>
        </div>
      </div>
        </div>
    )
  }

  