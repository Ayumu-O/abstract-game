import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import Buttons from "./components/Buttons";
import Description from "./components/Description";
import PlayerInfo from "./components/PlayerInfo";
import Sidebar from "./components/Sidebar";
import { BoardState } from "./domain/boardState";
import { Candidates } from "./domain/candidates";
import { Player } from "./domain/player";
import { boardStateAtom, candidatesAtom, serialAtom } from "./store";

function App() {
  const setState = useSetAtom(boardStateAtom);
  const setCandidates = useSetAtom(candidatesAtom);
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
    setCandidates(Candidates.calcCandidates(newBoardState));
  }, [serial, setState]);

  return (
    <div className="h-screen overflow-auto">
      <div className="flex flex-col-reverse min-h-screen w-[min(88%,1166px)] mx-auto md:flex-row gap-[4vh] lg:w-[min(72%,1166px)]">
        <Sidebar />
        <div className="flex flex-2 flex-col items-center justify-center gap-[4vh] my-[8vh] max-md:mt-0">
          <Description />
          <Board />
        </div>
        <div className="flex flex-col flex-1 justify-center gap-[4vh] my-[8vh] w-auto max-md:mb-0">
          <Buttons />
          <div className="flex gap-[4vh] md:flex-col justify-between">
            <PlayerInfo player={Player.PLAYER1} />
            <PlayerInfo player={Player.PLAYER2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
