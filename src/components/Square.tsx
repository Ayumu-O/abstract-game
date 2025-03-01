import { useAtom } from "jotai";
import { Candidates } from "../domain/candidates";
import { Cell } from "../domain/cell";
import { Player } from "../domain/player";
import { boardStateAtom, candidatesAtom, cursoredCellAtom } from "../store";

function Square({ cell }: { cell: Cell }) {
  const [state, setState] = useAtom(boardStateAtom);
  const [candidates, setCandidates] = useAtom(candidatesAtom);
  const [cursoredCell, setCursoredCell] = useAtom(cursoredCellAtom);

  const handleSquareClick = (e: React.MouseEvent, cell: Cell) => {
    e.preventDefault();
    if (!candidates.canPlace(cell)) {
      return;
    }

    const newState = state.movePiece(state.player, cell);

    setCursoredCell(null);
    setState(newState);
    setCandidates(Candidates.calcCandidates(newState));
  };

  const handleSquareMouseEnter = (e: React.MouseEvent, cell: Cell) => {
    e.preventDefault();
    if (candidates.canPlace(cell)) {
      setCursoredCell(cell);
    }
  };

  const handleSquareMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setCursoredCell(null);
  };

  let displayText = "";
  let btnColor = "btn-neutral";
  if (cell.player === Player.PLAYER1) {
    displayText = "1";
    btnColor = "btn-primary";
  } else if (cell.player === Player.PLAYER2) {
    displayText = "2";
    btnColor = "btn-secondary";
  }
  if (candidates.canPlace(cell)) {
    btnColor += " opacity-30";
    btnColor += state.playerIs1 ? " bg-primary" : " bg-secondary";
  }
  if (cursoredCell && cursoredCell.equals(cell)) {
    btnColor += " opacity-70";
    btnColor += state.playerIs1 ? " bg-primary" : " bg-secondary";
  }
  return (
    <button
      className={`btn ${btnColor} p-0 h-auto aspect-square`}
      key={cell.key}
      onClick={(e) => handleSquareClick(e, cell)}
      onMouseEnter={(e) => handleSquareMouseEnter(e, cell)}
      onMouseLeave={(e) => handleSquareMouseLeave(e)}
    >
      {displayText}
    </button>
  );
}

export default Square;
