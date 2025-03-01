import { useAtom } from "jotai";
import { Candidates } from "../domain/candidates";
import { Cell } from "../domain/cell";
import { Player } from "../domain/player";
import { boardStateAtom, candidatesAtom, cursoredWallAtom } from "../store";

function Space({ cell }: { cell: Cell }) {
  const [state, setState] = useAtom(boardStateAtom);
  const [candidates, setCandidates] = useAtom(candidatesAtom);
  const [cursoredWall, setCursoredWall] = useAtom(cursoredWallAtom);

  const handleSpaceClick = (e: React.MouseEvent, cell: Cell) => {
    e.preventDefault();
    if (!candidates.canPlace(cell)) {
      return;
    }

    const newState = state.placeWall(state.player, cell);

    setCursoredWall(null);
    setState(newState);
    setCandidates(Candidates.calcCandidates(newState));
  };

  const handleSpaceMouseEnter = (e: React.MouseEvent, cell: Cell) => {
    e.preventDefault();
    if (candidates.canPlace(cell)) {
      setCursoredWall(
        cell.isSpaceH ? state.getWallCellsH(cell) : state.getWallCellsV(cell)
      );
    }
  };

  const handleSpaceMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    setCursoredWall(null);
  };

  let properties = "";
  // 壁が置いてある場合は色を変える
  if (cell.player === Player.PLAYER1) {
    properties += " border-0 rounded-none bg-primary";
  }
  if (cell.player === Player.PLAYER2) {
    properties += " border-0 rounded-none bg-secondary";
  }
  // カーソルが乗っている場合は色を変える
  if (cursoredWall && cursoredWall.some((c) => c.equals(cell))) {
    properties += " border-0 rounded-none opacity-50";
    properties += state.playerIs1 ? " bg-primary" : " bg-secondary";
  }
  return (
    <div
      className={`btn ${properties} p-0 h-auto`}
      key={cell.key}
      onClick={(e) => handleSpaceClick(e, cell)}
      onMouseEnter={(e) => handleSpaceMouseEnter(e, cell)}
      onMouseLeave={(e) => handleSpaceMouseLeave(e)}
    ></div>
  );
}

export default Space;
