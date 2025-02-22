import { useAtom } from "jotai";
import { Cell } from "../domain/cell";
import { Player } from "../domain/player";
import { boardStateAtom, cursoredCellAtom } from "../store";

function Space({ cell }: { cell: Cell }) {
  const [state, setState] = useAtom(boardStateAtom);
  const [cursoredCell, setCursoredCell] = useAtom(cursoredCellAtom);

  const handleSpaceClick = (e: React.MouseEvent, cell: Cell) => {
    e.preventDefault();
    if (!state.canPlace(cell)) {
      return;
    }

    const newState = state.placeWall(state.player, cell);

    setCursoredCell(null);
    setState(newState);
  };

  const handleSpaceMouseEnter = (e: React.MouseEvent, cell: Cell) => {
    e.preventDefault();
    if (state.canPlace(cell)) {
      setCursoredCell(cell);
    }
  };

  const handleSpaceMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setCursoredCell(null);
  };

  let properties = "w-[20px] h-[20px]";
  // 縦
  if (cell.isSpaceH) {
    properties = "w-[50px] h-[20px]";
  }
  // 横
  if (cell.isSpaceV) {
    properties = "w-[20px] h-[50px]";
  }
  // 壁が置いてある場合は色を変える
  if (cell.player === Player.PLAYER1) {
    properties += " border-0 rounded-none bg-primary";
  }
  if (cell.player === Player.PLAYER2) {
    properties += " border-0 rounded-none bg-secondary";
  }
  // カーソルが乗っている場合は色を変える
  if (cursoredCell && cell.equals(cursoredCell)) {
    properties += " border-0 rounded-none opacity-50";
    properties += state.playerIs1 ? " bg-primary" : " bg-secondary";
  }
  return (
    <div
      className={`btn ${properties} p-0`}
      key={cell.key}
      onClick={(e) => handleSpaceClick(e, cell)}
      onMouseEnter={(e) => handleSpaceMouseEnter(e, cell)}
      onMouseLeave={(e) => handleSpaceMouseLeave(e)}
    ></div>
  );
}

export default Space;
