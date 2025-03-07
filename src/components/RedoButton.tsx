import { useAtom, useSetAtom } from "jotai";
import { Candidates } from "../domain/candidates";
import { boardStateAtom, candidatesAtom } from "../store";

function RedoButton() {
  const [state, setState] = useAtom(boardStateAtom);
  const setCandidates = useSetAtom(candidatesAtom);

  const handleClickRedo = (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = state.redo();
    setState(newState);
    setCandidates(Candidates.calcCandidates(newState));
  };

  const active = state.canRedo ? "" : "btn-disabled";

  return (
    <button
      className={`btn btn-accent ${active} controll-btn`}
      onClick={(e) => handleClickRedo(e)}
    >
      Redo
    </button>
  );
}

export default RedoButton;
