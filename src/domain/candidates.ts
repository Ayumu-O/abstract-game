import { BoardState } from "./boardState";
import { Cell, Position, PositionError } from "./cell";
import { Player } from "./player";
import { Settings } from "./settings";

export class Candidates {
  constructor(public candidates: Position[]) {}

  public canPlace(cell: Cell): boolean {
    return this.candidates.some((c) => c.equals(cell));
  }

  // 候補セルを計算する
  public static calcCandidates(state: BoardState): Candidates {
    if (state.winner) {
      return new Candidates([]);
    }
    const pieceCandidates = Candidates.calcPieceCandidates(state);
    const wallCandidates = Candidates.calcWallCandidates(state);
    return new Candidates([
      ...pieceCandidates.candidates,
      ...wallCandidates.candidates,
    ]);
  }

  private static directions = [
    [-1, 0], // 左
    [0, -1], // 上
    [1, 0], // 右
    [0, 1], // 下
  ];

  // 駒の移動可能なセルを計算する
  private static calcPieceCandidates(state: BoardState): Candidates {
    const candidates: Position[] = [];
    const piece = state.getPlayerPiece(state.player);

    Candidates.directions.forEach((direction, index) => {
      const step1 = Candidates.getMovedCell(state, piece, direction);
      // 盤外に出る場合や壁がある場合はスキップ
      if (!step1 || step1.player) {
        return;
      }

      const step2 = Candidates.getMovedCell(state, step1, direction);
      if (step2 && !step2.player) {
        // 2マス先に相手の駒がない場合は候補に追加
        candidates.push(step2);
      } else {
        // 2マス先に相手の駒がある場合
        const step3 = Candidates.getMovedCell(state, step2!, direction);
        if (!step3 || step3.player) {
          // 相手の駒を飛び越えた先に壁がある場合は斜めに移動できるか確認する
          for (let turn = 1; turn <= 3; turn += 2) {
            const newDirection = Candidates.directions[(index + turn) % 4];
            const reStep3 = Candidates.getMovedCell(
              state,
              step2!,
              newDirection
            );
            if (!reStep3 || reStep3.player) {
              continue;
            }
            const step4 = Candidates.getMovedCell(
              state,
              reStep3!,
              newDirection
            );
            if (step4) {
              candidates.push(step4);
            }
          }
        } else {
          // 相手の駒を飛び越えることができる場合
          const step4 = Candidates.getMovedCell(state, step3, direction);
          candidates.push(step4!);
        }
      }
    });

    return new Candidates(candidates);
  }

  // 壁を設置可能なセルを計算する
  private static calcWallCandidates(state: BoardState): Candidates {
    // プレイヤーに壁が残っていない場合はスキップ
    if (state.getPlayerWalls(state.player) === 0) {
      return new Candidates([]);
    }

    const candidates: Position[] = [];
    state.cells.forEach((cell) => {
      if (cell.isSquare || cell.isSpaceCross) {
        // 駒が置かれているセルや交差点には壁を設置できない
        return;
      }

      let wallCells: Cell[];
      if (cell.isSpaceH) {
        if (cell.x === Settings.BOARD_SIDE_LENGTH - 1) {
          // 右端に壁は設置できない
          return;
        }
        wallCells = state.getWallCellsH(cell);
      } else {
        if (cell.y === Settings.BOARD_SIDE_LENGTH - 1) {
          // 下端に壁は設置できない
          return;
        }
        wallCells = state.getWallCellsV(cell);
      }

      if (wallCells.some((cell) => cell.player)) {
        // すでに壁が設置されている場合はスキップ
        return;
      }

      // 壁を設置した場合に駒が到達可能かどうかを確認
      const tmpState = state.placeWall(state.player, cell, true);
      if (Candidates.checkReachable(tmpState)) {
        candidates.push(cell);
      }
    });

    return new Candidates(candidates);
  }

  // 仮に移動した後の駒の位置を返す
  private static getMovedCell(
    state: BoardState,
    position: Position,
    direction: number[]
  ) {
    const x = position.x + direction[0];
    const y = position.y + direction[1];
    try {
      return state.getCell(new Position(x, y));
    } catch (e) {
      if (e instanceof PositionError) {
        return null;
      }
      throw e;
    }
  }

  // 駒が相手陣地に到達可能かどうかを確認する
  private static checkReachable(state: BoardState) {
    loopPlayer: for (let player of [Player.PLAYER1, Player.PLAYER2]) {
      const visited = new Int8Array(Settings.BOARD_SIDE_LENGTH ** 2).fill(0);
      // 現在の位置からBFSを行う
      const queue = [state.getPlayerPiece(player)];

      while (queue.length > 0) {
        const now = queue.pop();
        if (!now) {
          // キューが空になったら終了
          break;
        }
        if (visited[now.key]) {
          // すでに訪れたセルはスキップ
          continue;
        }
        visited[now.key] = 1;

        // ゴールに到達したかチェック
        if (
          player === Player.PLAYER1 &&
          now.y === Settings.BOARD_SIDE_LENGTH - 1
        ) {
          continue loopPlayer;
        } else if (player === Player.PLAYER2 && now.y === 0) {
          continue loopPlayer;
        }

        // 4方向への移動をチェック
        for (let direction of Candidates.directions) {
          const sub = Candidates.getMovedCell(state, now, direction);
          // 盤外や壁がある場合はスキップ
          if (!sub || sub.player) {
            continue;
          }
          const next = Candidates.getMovedCell(state, sub, direction);
          if (visited[next!.key]) {
            // すでに訪れたセルはスキップ
            continue;
          }
          // 次のセルをキューに追加
          queue.push(next!);
        }
      }

      // ゴールに到達できなかった場合
      return false;
    }
    // どちらもゴールに到達できた場合
    return true;
  }
}
