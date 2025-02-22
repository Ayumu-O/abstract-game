import { Cell, Position, PositionError } from "./cell";
import { Player } from "./player";
import { Settings } from "./settings";

export class BoardState {
  public candidates: Position[];
  public winner: Player | null = null;

  constructor(
    public cells: Cell[],
    public player: Player,
    public walls: number[],
    private readonly needCalcCandidates = true
  ) {
    this.winner = this.calcWinner();
    this.candidates = [];
    if (!this.winner && this.needCalcCandidates) {
      this.candidates = this.calcCandidates();
    }
  }

  // プレイヤーがPLAYER1かどうかを判定する
  get playerIs1() {
    return this.player === Player.PLAYER1;
  }

  // ボードの初期状態をリセットする
  public static reset() {
    const initilaCells = [];
    for (let y = 0; y < Settings.BOARD_SIDE_LENGTH; y++) {
      for (let x = 0; x < Settings.BOARD_SIDE_LENGTH; x++) {
        let player = null;
        if (x === Settings.CENTER_X && y === 0) {
          player = Player.PLAYER1;
        } else if (
          x === Settings.CENTER_X &&
          y === Settings.BOARD_SIDE_LENGTH - 1
        ) {
          player = Player.PLAYER2;
        }
        initilaCells.push(new Cell(x, y, player));
      }
    }
    const walls = [Settings.INITIAL_WALL_COUNT, Settings.INITIAL_WALL_COUNT];
    return new BoardState(initilaCells, Player.PLAYER1, walls);
  }

  // 指定されたセルに駒を置けるかどうかを判定する
  public canPlace(cell: Cell) {
    return this.candidates.some((c) => c.equals(cell));
  }

  // 駒を移動する
  public movePiece(player: Player, to: Cell) {
    const oldPlayerPiece = this.getPlayerPiece(player);
    const newCells = this.cells.map((cell) => {
      if (cell.equals(to)) {
        return new Cell(cell.x, cell.y, player);
      } else if (cell.equals(oldPlayerPiece)) {
        return new Cell(cell.x, cell.y, null);
      } else {
        return cell;
      }
    });
    const nextPlayer = this.playerIs1 ? Player.PLAYER2 : Player.PLAYER1;
    return new BoardState(newCells, nextPlayer, this.walls);
  }

  // 壁を設置する
  public placeWall(player: Player, to: Cell, temporary = false) {
    const wallCells = to.isSpaceH
      ? this.getWallCellsH(to)
      : this.getWallCellsV(to);

    const newCells = this.cells.map((cell) => {
      if (wallCells.some((wallCell) => wallCell.equals(cell))) {
        return new Cell(cell.x, cell.y, player);
      } else {
        return cell;
      }
    });

    const nextPlayer = this.playerIs1 ? Player.PLAYER2 : Player.PLAYER1;

    // 壁の数を減らす
    let newWalls;
    if (this.playerIs1) {
      newWalls = [this.walls[0] - 1, this.walls[1]];
    } else {
      newWalls = [this.walls[0], this.walls[1] - 1];
    }
    return new BoardState(newCells, nextPlayer, newWalls, !temporary);
  }

  // プレイヤーの駒を取得する
  private getPlayerPiece(player: Player) {
    return this.cells.filter(
      (cell) => cell.player === player && cell.isSquare
    )[0];
  }

  // プレイヤーの壁の数を取得する
  public getPlayerWalls(player: Player) {
    return this.walls[player === Player.PLAYER1 ? 0 : 1];
  }

  // 指定されたセルを取得する
  private getCell(position: Position) {
    return this.cells[position.key];
  }

  // 指定された位置を基準に壁の座標を取得する
  public getWallCellsH(position: Position) {
    return [
      this.getCell(new Position(position.x, position.y)),
      this.getCell(new Position(position.x + 1, position.y)),
      this.getCell(new Position(position.x + 2, position.y)),
    ];
  }

  public getWallCellsV(position: Position) {
    return [
      this.getCell(new Position(position.x, position.y)),
      this.getCell(new Position(position.x, position.y + 1)),
      this.getCell(new Position(position.x, position.y + 2)),
    ];
  }

  // 勝者を計算する
  private calcWinner() {
    // 反対側のラインに到達したプレイヤーが勝者
    if (
      this.getPlayerPiece(Player.PLAYER1).y ===
      Settings.BOARD_SIDE_LENGTH - 1
    ) {
      return Player.PLAYER1;
    }
    if (this.getPlayerPiece(Player.PLAYER2).y === 0) {
      return Player.PLAYER2;
    }
    return null;
  }

  // 候補セルを計算する
  private calcCandidates(): Position[] {
    const pieceCandidates = this.calcPieceCandidates();
    const wallCandidates = this.calcWallCandidates();
    return pieceCandidates.concat(wallCandidates);
  }

  private static directions = [
    [-1, 0], // 左
    [0, -1], // 上
    [1, 0], // 右
    [0, 1], // 下
  ];

  // 駒の移動可能なセルを計算する
  private calcPieceCandidates(): Position[] {
    const candidates: Position[] = [];
    const piece = this.getPlayerPiece(this.player);

    BoardState.directions.forEach((direction, index) => {
      const step1 = this.getMovedCell(piece, direction);
      // 盤外に出る場合や壁がある場合はスキップ
      if (!step1 || step1.player) {
        return;
      }

      const step2 = this.getMovedCell(step1, direction);
      if (step2 && !step2.player) {
        // 2マス先に相手の駒がない場合は候補に追加
        candidates.push(step2);
      } else {
        // 2マス先に相手の駒がある場合
        const step3 = this.getMovedCell(step2!, direction);
        if (step3 && step3.player) {
          // 相手の駒を飛び越えた先に壁がある場合は斜めに移動できるか確認する
          for (let turn = 1; turn <= 3; turn += 2) {
            const newDirection = BoardState.directions[(index + turn) % 4];
            const reStep3 = this.getMovedCell(step2!, newDirection);
            if (!reStep3 || reStep3.player) {
              continue;
            }
            const step4 = this.getMovedCell(reStep3!, newDirection);
            if (step4) {
              candidates.push(step4);
            }
          }
        } else {
          // 相手の駒を飛び越えることができる場合
          const step4 = this.getMovedCell(step3!, direction);
          candidates.push(step4!);
        }
      }
    });

    return candidates;
  }

  // 壁を設置可能なセルを計算する
  private calcWallCandidates(): Position[] {
    console.log("calcWallCandidates");
    // プレイヤーに壁が残っていない場合はスキップ
    if (this.getPlayerWalls(this.player) === 0) {
      return [];
    }

    const candidates: Position[] = [];
    this.cells.forEach((cell) => {
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
        wallCells = this.getWallCellsH(cell);
      } else {
        if (cell.y === Settings.BOARD_SIDE_LENGTH - 1) {
          // 下端に壁は設置できない
          return;
        }
        wallCells = this.getWallCellsV(cell);
      }

      if (wallCells.some((cell) => cell.player)) {
        // すでに壁が設置されている場合はスキップ
        return;
      }

      // 壁を設置した場合に駒が到達可能かどうかを確認
      const tmpState = this.placeWall(this.player, cell, true);
      if (tmpState.checkReachable()) {
        candidates.push(cell);
      }
    });

    return candidates;
  }

  // 仮に移動した後の駒の位置を返す
  private getMovedCell(position: Position, direction: number[]) {
    const x = position.x + direction[0];
    const y = position.y + direction[1];
    try {
      return this.getCell(new Position(x, y));
    } catch (e) {
      if (e instanceof PositionError) {
        return null;
      }
      throw e;
    }
  }

  // 駒が相手陣地に到達可能かどうかを確認する
  private checkReachable() {
    loopPlayer: for (let player of [Player.PLAYER1, Player.PLAYER2]) {
      const visited = new Int8Array(Settings.BOARD_SIDE_LENGTH ** 2).fill(0);
      // 現在の位置からBFSを行う
      const queue = [this.getPlayerPiece(player)];

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
        for (let direction of BoardState.directions) {
          const sub = this.getMovedCell(now, direction);
          // 盤外や壁がある場合はスキップ
          if (!sub || sub.player) {
            continue;
          }
          const next = this.getMovedCell(sub, direction);
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
