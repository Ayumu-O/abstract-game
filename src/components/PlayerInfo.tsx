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
    <div className={`border border-${color} h-60 rounded p-8 mb-10 w-full`}>
      <div className="flex items-center">
        <div className={`btn ${btnColor} w-[30px] h-[30px] mr-4`}>
          {sampleBtnText}
        </div>
        {playerName}
      </div>
      <div className="flex mt-4">
        {Array.from({ length: wallNum }).map((_, i) => (
          <div key={i} className={`bg-${color} w-[10px] h-[50px] mr-4`}></div>
        ))}
      </div>
    </div>
  );
}

export default PlayerInfo;
