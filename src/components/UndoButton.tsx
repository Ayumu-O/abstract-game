import { useAtom, useSetAtom } from "jotai";
import { Candidates } from "../domain/candidates";
import { boardStateAtom, candidatesAtom } from "../store";

function UndoButton() {
  const [state, setState] = useAtom(boardStateAtom);
  const setCandidates = useSetAtom(candidatesAtom);

  const handleClickUndo = (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = state.undo();
    setState(newState);
    setCandidates(Candidates.calcCandidates(newState));
  };

  const active = state.canUndo ? "" : "btn-disabled";

  return (
    <button
      className={`btn btn-accent ${active} controll-btn`}
      onClick={(e) => handleClickUndo(e)}
    >
      Undo
    </button>
  );
}

export default UndoButton;
