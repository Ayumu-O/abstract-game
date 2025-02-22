import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import Buttons from "./components/Buttons";
import Description from "./components/Description";
import PlayerInfo from "./components/PlayerInfo";
import Sidebar from "./components/Sidebar";
import { BoardState } from "./domain/boardState";
import { Player } from "./domain/player";
import { boardStateAtom, serialAtom } from "./store";

function App() {
  const setState = useSetAtom(boardStateAtom);
  const serial = useAtomValue(serialAtom);

  useEffect(() => {
    let newBoardState;
    if (serial) {
      try {
        newBoardState = BoardState.deserialize(serial);
      } catch (e) {
        return;
      }
    } else {
      newBoardState = BoardState.reset();
    }
    setState(newBoardState);
  }, [serial, setState]);

  return (
    <div className="flex h-screen w-full justify-center">
      <Sidebar />
      <div className="flex justify-center ml-20 w-full">
        <div className="flex flex-col items-center justify-center">
          <Description />
          <Board />
        </div>
        <div className="ml-20 w-88 flex flex-col items-start justify-center">
          <Buttons />
          <PlayerInfo player={Player.PLAYER1} />
          <PlayerInfo player={Player.PLAYER2} />
        </div>
      </div>
    </div>
  );
}

export default App;
