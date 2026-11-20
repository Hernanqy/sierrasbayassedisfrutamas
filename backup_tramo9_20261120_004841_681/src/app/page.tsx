"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CircleHelp,
  Compass,
  Gift,
  Home,
  Layers3,
  Map,
  MapPin,
  Medal,
  Search,
  Sparkles,
  Star,
  Trophy,
  Volume2,
} from "lucide-react";

type Screen = "landing" | "host" | "games" | "play" | "reward" | "passport" | "places";
type GameMode = "treasure" | "quiz" | "story" | "detective" | null;

type Place = {
  code: string;
  name: string;
  circuit: "Aventura" | "Histórico";
  theme: string;
  kind: string;
};

const places: Place[] = [
  { code: "1", name: "Museo de la Estación", circuit: "Histórico", theme: "ferrocarril", kind: "history" },
  { code: "2", name: "Club San Martín", circuit: "Histórico", theme: "vida social", kind: "history" },
  { code: "3", name: "Antiguo Barrio Fábrica", circuit: "Histórico", theme: "barrio obrero", kind: "history" },
  { code: "4", name: "Monumento al Primer Despacho de Cemento | Antigua Fábrica de Cemento", circuit: "Histórico", theme: "cemento", kind: "history" },
  { code: "5", name: "Iglesia Cristo Rey", circuit: "Histórico", theme: "comunidad", kind: "history" },
  { code: "6", name: "Monumento Centro del Universo", circuit: "Histórico", theme: "identidad", kind: "history" },
  { code: "7", name: "Monumento al Trabajador del Cemento", circuit: "Histórico", theme: "trabajo", kind: "history" },
  { code: "8", name: "Paraje Huecu Fu Hum", circuit: "Histórico", theme: "memoria", kind: "history" },
  { code: "9", name: "Paseo de las Vagonetas", circuit: "Histórico", theme: "ferrocarril", kind: "history" },
  { code: "10", name: "La Calera 1888", circuit: "Histórico", theme: "minería", kind: "history" },
  { code: "11", name: "Antigua Calera La Libertadora", circuit: "Histórico", theme: "caleras", kind: "history" },
  { code: "12", name: "Calera Piatti - Mouriño", circuit: "Histórico", theme: "caleras", kind: "history" },
  { code: "13", name: "Calera La Victoria", circuit: "Histórico", theme: "caleras", kind: "history" },
  { code: "14", name: "Antiguas casas de piedra", circuit: "Histórico", theme: "arquitectura", kind: "history" },
  { code: "15", name: "Réplica Casa Matilde Catriel", circuit: "Histórico", theme: "memoria", kind: "history" },
  { code: "16", name: "Boca Sierra", circuit: "Histórico", theme: "primer asentamiento minero", kind: "history" },
  { code: "A", name: "Mirador de Cantera", circuit: "Aventura", theme: "paisaje", kind: "adventure" },
  { code: "B", name: "Cerro Matilde y Parque Matilde Catriel", circuit: "Aventura", theme: "cerro", kind: "adventure" },
  { code: "C", name: "Mirador del Paseo del Mástil Carlos Medici", circuit: "Aventura", theme: "mirador", kind: "adventure" },
  { code: "D", name: "Mirador Monte de los Fresnos", circuit: "Aventura", theme: "reserva", kind: "adventure" },
  { code: "E", name: "Mirador Cerro del Diablo", circuit: "Aventura", theme: "reserva", kind: "adventure" },
  { code: "F", name: "Paseo Recuperado", circuit: "Aventura", theme: "recorrido", kind: "adventure" },
  { code: "G", name: "Cerro Largo", circuit: "Aventura", theme: "paisaje", kind: "adventure" },
  { code: "H", name: "Boca Sierra", circuit: "Aventura", theme: "memoria", kind: "adventure" },
  { code: "I", name: "Cerro Aguirre (San Cayetano)", circuit: "Aventura", theme: "cerro", kind: "adventure" },
  { code: "J", name: "Parque Biciesenda", circuit: "Aventura", theme: "movimiento", kind: "adventure" },
];

const gameCards = [
  { id: "treasure", title: "Búsqueda", subtitle: "Seguí pistas", icon: Search, color: "gold" },
  { id: "quiz", title: "Preguntas", subtitle: "Elegí la correcta", icon: CircleHelp, color: "violet" },
  { id: "story", title: "Reconstruí", subtitle: "Ordená la historia", icon: BookOpen, color: "mint" },
  { id: "detective", title: "Detective", subtitle: "Leé la escena", icon: Sparkles, color: "rose" },
] as const;

function getWelcome(place: Place) {
  return `Hola. Estás en ${place.name}. Este lugar forma parte del circuito ${place.circuit.toLowerCase()} de Sierras Bayas. Elegí una forma de jugar, resolvé el desafío y conseguí tu sello.`;
}

function speech(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "es-AR";
  utter.rate = 0.97;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function getReward(mode: GameMode) {
  switch (mode) {
    case "treasure":
      return { title: "Sello conseguido", text: "Seguiste las pistas y encontraste la respuesta.", points: 100 };
    case "quiz":
      return { title: "Respuesta acertada", text: "Superaste la ronda de preguntas del lugar.", points: 80 };
    case "story":
      return { title: "Historia completa", text: "Lograste reconstruir el mensaje del lugar.", points: 90 };
    case "detective":
      return { title: "Caso resuelto", text: "Descubriste la pista principal de la escena.", points: 110 };
    default:
      return { title: "Recompensa", text: "Desafío superado.", points: 50 };
  }
}

function getChallenge(place: Place, mode: GameMode) {
  if (mode === "treasure") {
    return {
      prompt: `¿Qué tema principal vas a descubrir en ${place.name}?`,
      options: [place.theme, "playa", "espacio sideral"],
      answer: place.theme,
    };
  }
  if (mode === "quiz") {
    return {
      prompt: `${place.name} pertenece al circuito...`,
      options: [place.circuit, place.circuit === "Histórico" ? "Aventura" : "Histórico", "No pertenece a ningún circuito"],
      answer: place.circuit,
    };
  }
  if (mode === "story") {
    return {
      prompt: "Ordená mentalmente esta idea: lugar → juego → sello. ¿Cuál es el paso final?",
      options: ["Juego", "Sello", "Lugar"],
      answer: "Sello",
    };
  }
  return {
    prompt: `Leé la pista: “Este desafío está ligado a ${place.theme}”. ¿Qué opción coincide mejor con ${place.name}?`,
    options: [place.theme, "océano", "desierto"],
    answer: place.theme,
  };
}

const AppHome = () => {
  const params = useSearchParams();
  const codeFromQuery = params.get("lugar") || "1";
  const initialPlace =
    places.find((p) => p.code.toLowerCase() === codeFromQuery.toLowerCase()) || places[0];

  const [screen, setScreen] = useState<Screen>("landing");
  const [selectedPlace, setSelectedPlace] = useState<Place>(initialPlace);
  const [selectedGame, setSelectedGame] = useState<GameMode>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [points, setPoints] = useState(0);
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    const savedPoints = Number(localStorage.getItem("sb_points") || "0");
    const savedEarned = JSON.parse(localStorage.getItem("sb_earned") || "[]");
    setPoints(savedPoints);
    if (Array.isArray(savedEarned)) setEarned(savedEarned);
  }, []);

  useEffect(() => {
    localStorage.setItem("sb_points", String(points));
    localStorage.setItem("sb_earned", JSON.stringify(earned));
  }, [points, earned]);

  const challenge = useMemo(() => getChallenge(selectedPlace, selectedGame), [selectedPlace, selectedGame]);
  const reward = useMemo(() => getReward(selectedGame), [selectedGame]);

  function startGame(mode: GameMode) {
    setSelectedGame(mode);
    setSelectedAnswer("");
    setResultMessage("");
    setScreen("play");
  }

  function submitAnswer() {
    const ok = selectedAnswer === challenge.answer;
    const stampId = `${selectedPlace.code}-${selectedGame}`;
    setResultMessage(ok ? "¡Muy bien!" : "Buena prueba igualmente");

    if (!earned.includes(stampId)) {
      setEarned((prev) => [...prev, stampId]);
      setPoints((p) => p + (ok ? reward.points : Math.round(reward.points * 0.6)));
    }

    setScreen("reward");
  }

  const titlePlaceShort =
    selectedPlace.name.length > 42 ? `${selectedPlace.name.slice(0, 42)}…` : selectedPlace.name;

  return (
    <div className="sb-page">
      <div className="phone-shell">
        {screen !== "landing" && (
          <header className="topbar">
            <div className="brand-mini">
              <span>Sierras Bayas</span>
              <small>SE DISFRUTA MÁS</small>
            </div>
            <div className="score-pill">
              <Star size={14} fill="currentColor" /> {points}
            </div>
          </header>
        )}

        {screen === "landing" && (
          <section className="screen hero-screen">
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-logo">Sierras Bayas</div>
              <div className="hero-sub">SE DISFRUTA MÁS</div>
              <div className="hero-badge">
                {selectedPlace.circuit} · {selectedPlace.code}
              </div>
              <h1>Aprendé, jugá y explorá</h1>
              <p>{titlePlaceShort}</p>
              <button className="cta-button" onClick={() => setScreen("host")}>Entrar</button>
              <button className="ghost-button" onClick={() => setScreen("passport")}>Ver pasaporte</button>
            </div>
          </section>
        )}

        {screen === "host" && (
          <section className="screen deep-screen">
            <button className="back-button" onClick={() => setScreen("landing")}>
              <ArrowLeft size={18} />
            </button>
            <div className="orb orb-left" />
            <div className="orb orb-right" />
            <div className="host-portrait">
              <div className="portrait-ring">
                <MapPin size={42} />
              </div>
            </div>
            <div className="center-panel speech-panel">
              <span className="panel-kicker">Tu anfitrión</span>
              <h2>¡Hola, explorador!</h2>
              <p>{getWelcome(selectedPlace)}</p>
              <div className="panel-actions">
                <button className="small-ghost" onClick={() => speech(getWelcome(selectedPlace))}>
                  <Volume2 size={16} /> Escuchar
                </button>
                <button className="small-cta" onClick={() => setScreen("games")}>Continuar</button>
              </div>
            </div>
          </section>
        )}

        {screen === "games" && (
          <section className="screen deep-screen">
            <button className="back-button" onClick={() => setScreen("host")}>
              <ArrowLeft size={18} />
            </button>
            <div className="center-panel compact-top">
              <span className="panel-kicker">
                {selectedPlace.circuit} · {selectedPlace.code}
              </span>
              <h2>Elegí un juego</h2>
              <p>{titlePlaceShort}</p>
            </div>
            <div className="game-grid">
              {gameCards.map((game) => {
                const Icon = game.icon;
                return (
                  <button
                    key={game.id}
                    className={`game-card ${game.color}`}
                    onClick={() => startGame(game.id as GameMode)}
                  >
                    <div className="game-icon">
                      <Icon size={34} />
                    </div>
                    <strong>{game.title}</strong>
                    <span>{game.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {screen === "play" && selectedGame && (
          <section className="screen deep-screen">
            <button className="back-button" onClick={() => setScreen("games")}>
              <ArrowLeft size={18} />
            </button>
            <div className="play-head center-panel compact-top">
              <span className="panel-kicker">Desafío activo</span>
              <h2>{gameCards.find((g) => g.id === selectedGame)?.title}</h2>
              <p>{titlePlaceShort}</p>
            </div>
            <div className="question-panel">
              <h3>{challenge.prompt}</h3>
              <div className="option-list">
                {challenge.options.map((option) => (
                  <button
                    key={option}
                    className={selectedAnswer === option ? "option active" : "option"}
                    onClick={() => setSelectedAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button className="cta-button bottom-space" disabled={!selectedAnswer} onClick={submitAnswer}>
                Resolver
              </button>
            </div>
          </section>
        )}

        {screen === "reward" && (
          <section className="screen reward-screen">
            <div className="reward-badge">
              <Medal size={52} />
            </div>
            <div className="center-panel reward-panel">
              <span className="panel-kicker">{resultMessage}</span>
              <h2>{reward.title}</h2>
              <p>{reward.text}</p>
              <div className="reward-pill">+ {reward.points} pts</div>
              <div className="panel-actions stacked">
                <button className="cta-button" onClick={() => setScreen("passport")}>Ver pasaporte</button>
                <button className="ghost-button" onClick={() => setScreen("games")}>Jugar otra vez</button>
              </div>
            </div>
          </section>
        )}

        {screen === "passport" && (
          <section className="screen deep-screen scrollable-screen">
            <button className="back-button" onClick={() => setScreen("landing")}>
              <ArrowLeft size={18} />
            </button>
            <div className="center-panel compact-top">
              <span className="panel-kicker">Colección general</span>
              <h2>Tu pasaporte</h2>
              <p>{earned.length} sellos conseguidos</p>
            </div>
            <div className="passport-stat-row">
              <div className="stat-card">
                <Trophy size={18} />
                <b>{points}</b>
                <span>Puntos</span>
              </div>
              <div className="stat-card">
                <Layers3 size={18} />
                <b>{earned.filter((e) => /^\d/.test(e)).length}</b>
                <span>Histórico</span>
              </div>
              <div className="stat-card">
                <Compass size={18} />
                <b>{earned.filter((e) => /^[A-Z]/.test(e)).length}</b>
                <span>Aventura</span>
              </div>
            </div>

            <div className="passport-section">
              <h3>Circuito Histórico</h3>
              <div className="stamp-grid">
                {places
                  .filter((p) => p.circuit === "Histórico")
                  .map((place) => {
                    const unlocked = earned.some((e) => e.startsWith(`${place.code}-`));
                    return (
                      <div key={place.code} className={unlocked ? "stamp unlocked" : "stamp"}>
                        <span>{place.code}</span>
                        <small>{unlocked ? place.name : "Por descubrir"}</small>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="passport-section">
              <h3>Circuito Aventura</h3>
              <div className="stamp-grid">
                {places
                  .filter((p) => p.circuit === "Aventura")
                  .map((place) => {
                    const unlocked = earned.some((e) => e.startsWith(`${place.code}-`));
                    return (
                      <div key={place.code} className={unlocked ? "stamp unlocked" : "stamp"}>
                        <span>{place.code}</span>
                        <small>{unlocked ? place.name : "Por descubrir"}</small>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        )}

        {screen === "places" && (
          <section className="screen deep-screen scrollable-screen">
            <button className="back-button" onClick={() => setScreen("landing")}>
              <ArrowLeft size={18} />
            </button>
            <div className="center-panel compact-top">
              <span className="panel-kicker">Lugares reales</span>
              <h2>Elegí una parada</h2>
              <p>Circuitos del folleto turístico</p>
            </div>
            <div className="place-list">
              {places.map((place) => (
                <button
                  key={place.code}
                  className="place-row"
                  onClick={() => {
                    setSelectedPlace(place);
                    setScreen("host");
                  }}
                >
                  <div className="place-code">{place.code}</div>
                  <div className="place-copy">
                    <strong>{place.name}</strong>
                    <small>{place.circuit}</small>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen !== "landing" && screen !== "reward" && (
          <nav className="bottom-nav">
            <button onClick={() => setScreen("landing")}>
              <Home size={18} />
              <span>Inicio</span>
            </button>
            <button onClick={() => setScreen("places")}>
              <Map size={18} />
              <span>Lugares</span>
            </button>
            <button onClick={() => setScreen("passport")}>
              <Gift size={18} />
              <span>Pasaporte</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default AppHome;
