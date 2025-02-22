import "./App.css";
import Board from "./components/Board";
import Description from "./components/Description";
import PlayerInfo from "./components/PlayerInfo";
import { Player } from "./domain/player";

function App() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center mt-10">
        <Description />
        <Board />
      </div>
      <div className="ml-20 mt-48 w-88 flex flex-col justify-between">
        <PlayerInfo player={Player.PLAYER1} />
        <PlayerInfo player={Player.PLAYER2} />
      </div>
    </div>
  );
}

export default App;
