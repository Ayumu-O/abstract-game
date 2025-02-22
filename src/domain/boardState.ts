import { Cell, Position, PositionError } from "./cell";
import { Player } from "./player";

export class BoardState {
  public candidates: Position[];
  public winner: Player | null = null;

  constructor(
    public cells: Cell[],
    public player: Player,
    public walls: number[]
  ) {
    this.candidates = this.calcCandidates();
    this.winner = this.calcWinner();
  }

  // プレイヤーがPLAYER1かどうかを判定する
  get playerIs1() {
    return this.player === Player.PLAYER1;
  }

  public static sideLength = 17;
  public static centerX = (BoardState.sideLength - 1) / 2;
  public static directions = [
    [-1, 0], // 左
    [0, -1], // 上
    [1, 0], // 右
    [0, 1], // 下
  ];
  public static initialWalls = 10;

  // ボードの初期状態をリセットする
  public static reset() {
    const initilaCells = [];
    for (let y = 0; y < BoardState.sideLength; y++) {
      for (let x = 0; x < BoardState.sideLength; x++) {
        let player = null;
        if (x === BoardState.centerX && y === 0) {
          player = Player.PLAYER1;
        } else if (
          x === BoardState.centerX &&
          y === BoardState.sideLength - 1
        ) {
          player = Player.PLAYER2;
        }
        initilaCells.push(new Cell(x, y, player));
      }
    }
    const walls = [BoardState.initialWalls, BoardState.initialWalls];
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
  public placeWall(player: Player, to: Cell) {
    let wallCells;
    if (to.isSpaceH) {
      wallCells = [
        new Position(to.x, to.y),
        new Position(to.x + 1, to.y),
        new Position(to.x + 2, to.y),
      ];
    } else if (to.isSpaceV) {
      wallCells = [
        new Position(to.x, to.y),
        new Position(to.x, to.y + 1),
        new Position(to.x, to.y + 2),
      ];
    } else {
      throw new Error("Invalid wall placement");
    }

    const newCells = this.cells.map((cell) => {
      if (wallCells.some((wallCell) => wallCell.equals(cell))) {
        return new Cell(cell.x, cell.y, player);
      } else {
        return cell;
      }
    });

    const nextPlayer = this.playerIs1 ? Player.PLAYER2 : Player.PLAYER1;

    let newWalls;
    if (this.playerIs1) {
      newWalls = [this.walls[0] - 1, this.walls[1]];
    } else {
      newWalls = [this.walls[0], this.walls[1] - 1];
    }
    return new BoardState(newCells, nextPlayer, newWalls);
  }

  // プレイヤーの駒を取得する
  private getPlayerPiece(player: Player) {
    return this.cells.filter(
      (cell) => cell.player === player && cell.isSquare
    )[0];
  }

  // プレイヤーの壁の数を取得する
  private getPlayerWalls(player: Player) {
    return this.walls[this.playerIs1 ? 0 : 1];
  }

  // 指定されたセルを取得する
  private getCell(position: Position) {
    return this.cells[position.key];
  }

  // 勝者を計算する
  private calcWinner() {
    if (this.getPlayerPiece(Player.PLAYER1).y === BoardState.sideLength - 1) {
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
    return [];
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
}
