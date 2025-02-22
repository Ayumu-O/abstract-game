import { useSetAtom } from "jotai";
import { BoardState } from "../domain/boardState";
import { boardStateAtom } from "../store";

function NewGameButton() {
  const setState = useSetAtom(boardStateAtom);

  const handleClickReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setState(BoardState.reset());
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
