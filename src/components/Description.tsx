import { useAtomValue } from "jotai";
import { boardStateAtom } from "../store";

function Description() {
  const state = useAtomValue(boardStateAtom);

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
    <div className="flex items-center justify-center w-full">
      <div
        className={`${bgColor} text-white rounded px-6 py-2 text-center w-full text-[2vh]`}
      >
        {description}
      </div>
    </div>
  );
}

export default Description;
