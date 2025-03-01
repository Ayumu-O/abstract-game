import { useAtomValue } from "jotai";
import { Player } from "../domain/player";
import { boardStateAtom } from "../store";

function PlayerInfo({ player }: { player: Player }) {
  const state = useAtomValue(boardStateAtom);

  const color = player === Player.PLAYER1 ? "primary" : "secondary";
  const wallNum = state.getPlayerWalls(player);
  const playerName = player === Player.PLAYER1 ? "Player1" : "Player2";
  const sampleBtnText = player === Player.PLAYER1 ? "1" : "2";
  const btnColor = player === Player.PLAYER1 ? "btn-primary" : "btn-secondary";

  return (
    <div className={`flex flex-col gap-4 border border-${color} rounded p-4`}>
      <div className="flex items-center gap-4 text-[2vh]">
        <div
          className={`btn ${btnColor} w-[3vh] h-auto aspect-square p-0 text-[2vh]`}
        >
          {sampleBtnText}
        </div>
        {playerName}
      </div>
      <div className="flex gap-[clamp(4px,1vw,8px)]">
        {Array.from({ length: wallNum }).map((_, i) => (
          <div key={i} className={`bg-${color} w-[1vw] aspect-1/5`}></div>
        ))}
      </div>
    </div>
  );
}

export default PlayerInfo;
