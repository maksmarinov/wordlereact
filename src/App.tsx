import "./styles.css";
import { Game } from "./components/Game";
import Links from "./components/Links";

export default function App() {
  return (
    <>
      <Links />
      <div className="game">
        <div className="title">
          <h2 className="title2">(/*React--Vite--TS)</h2>
          <h1> WORDLE </h1>
        </div>
        <div>
          <Game />
        </div>
      </div>
    </>
  );
}
