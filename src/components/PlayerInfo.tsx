import { useAtomValue } from "jotai";
import { Player } from "../domain/player";
import { boardStateAtom } from "../store";

function PlayerInfo({ player }: { player: Player }) {
  const state = useAtomValue(boardStateAtom);

  const color = player === Player.PLAYER1 ? "primary" : "secondary";
  const wallNum = state.getPlayerWalls(player);
  const playerName = player === Player.PLAYER1 ? "Player1" : "Player2";

  return (
    <div className={`border border-${color} h-60 rounded p-8 mb-10 w-full`}>
      {playerName}
      <div className="flex mt-4">
        {Array.from({ length: wallNum }).map((_, i) => (
          <div key={i} className={`bg-${color} w-[10px] h-[50px] mr-4`}></div>
        ))}
      </div>
    </div>
  );
}

export default PlayerInfo;
