import { useSetAtom } from "jotai";
import { BoardState } from "../domain/boardState";
import { Candidates } from "../domain/candidates";
import { boardStateAtom, candidatesAtom } from "../store";

function NewGameButton() {
  const setState = useSetAtom(boardStateAtom);
  const setCandidates = useSetAtom(candidatesAtom);

  const handleClickReset = (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = BoardState.reset();
    setState(newState);
    setCandidates(Candidates.calcCandidates(newState));
  };

  return (
    <button
      className="btn btn-neutral w-24 h-16 ml-4"
      onClick={(e) => handleClickReset(e)}
    >
      New Game
    </button>
  );
}

export default NewGameButton;
