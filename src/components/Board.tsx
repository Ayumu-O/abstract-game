import { useAtomValue } from "jotai";
import { Settings } from "../domain/settings";
import { boardStateAtom } from "../store";
import Space from "./Space";
import Square from "./Square";

function Board() {
  const state = useAtomValue(boardStateAtom);
  console.log(state);
  const { cells } = state;

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      {Array.from({ length: Settings.BOARD_SIDE_LENGTH }).map((row, y) => (
        <div className="flex " key={y}>
          {Array.from({ length: Settings.BOARD_SIDE_LENGTH }).map((col, x) => {
            const cell = cells.find((cell) => cell.x === x && cell.y === y);
            if (!cell) {
              return null;
            }
            if (cell.isSquare) {
              return <Square key={cell.key} cell={cell} />;
            } else {
              return <Space key={cell.key} cell={cell} />;
            }
          })}
        </div>
      ))}
    </div>
  );
}

export default Board;
