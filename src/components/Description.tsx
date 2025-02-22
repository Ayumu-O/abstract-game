import { useAtom } from "jotai";
import { BoardState } from "../domain/boardState";
import { boardStateAtom } from "../store";

function Description() {
  const [state, setState] = useAtom(boardStateAtom);

  const handleClickReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setState(BoardState.reset());
  };

  let bgColor;
  let description;
  if (state.winner) {
    description = `${state.winner} の勝ち！`;
    bgColor = "bg-green-500";
  } else {
    description = `${state.player} の番です`;
    bgColor = state.playerIs1 ? "bg-primary" : "bg-secondary";
  }
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${bgColor} text-white rounded px-6 py-2 w-120 text-center`}
      >
        {description}
      </div>
      {state.winner && (
        <button
          className="btn btn-neutral w-24 h-8 ml-4"
          onClick={(e) => handleClickReset(e)}
        >
          Reset
        </button>
      )}
    </div>
  );
}

export default Description;
