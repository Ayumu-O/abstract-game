import { useAtom } from "jotai";
import { Cell } from "../domain/cell";
import { Player } from "../domain/player";
import { boardStateAtom, cursoredCellAtom } from "../store";

function Square({ cell }: { cell: Cell }) {
  const [state, setState] = useAtom(boardStateAtom);
  const [cursoredCell, setCursoredCell] = useAtom(cursoredCellAtom);

  const handleSquareClick = (e: React.MouseEvent, cell: Cell) => {
    e.preventDefault();
    if (!state.canPlace(cell)) {
      return;
    }

    const newState = state.movePiece(state.player, cell);

    setCursoredCell(null);
    setState(newState);
  };

  const handleSquareMouseEnter = (e: React.MouseEvent, cell: Cell) => {
    e.preventDefault();
    if (state.canPlace(cell)) {
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
  if (cursoredCell && cell.equals(cursoredCell)) {
    btnColor += " opacity-50";
    btnColor += state.playerIs1 ? " bg-primary" : " bg-secondary";
  }
  return (
    <button
      className={`btn ${btnColor} w-[50px] h-[50px]`}
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
