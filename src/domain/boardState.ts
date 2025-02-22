import { Cell, Position } from "./cell";
import { Player } from "./player";
import { Settings } from "./settings";

export class BoardState {
  public winner: Player | null = null;

  constructor(
    public cells: Cell[],
    public player: Player,
    public walls: number[],
    public history: string[],
    public currentHistoryIndex: number
  ) {
    this.winner = this.calcWinner();
    this.addToHistory();
  }

  // 履歴に現在の状態を追加
  private addToHistory() {
    this.history = this.history.slice(0, this.currentHistoryIndex + 1);
    this.history.push(this.serialize());
    this.currentHistoryIndex++;
  }

  // undo可能かどうか
  get canUndo() {
    return this.currentHistoryIndex > 0;
  }

  // redo可能かどうか
  get canRedo() {
    return this.currentHistoryIndex < this.history.length - 1;
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
    return new BoardState(initilaCells, Player.PLAYER1, walls, [], -1);
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
    return new BoardState(
      newCells,
      nextPlayer,
      this.walls,
      this.history,
      this.currentHistoryIndex
    );
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
    return new BoardState(
      newCells,
      nextPlayer,
      newWalls,
      this.history,
      this.currentHistoryIndex
    );
  }

  // プレイヤーの駒を取得する
  public getPlayerPiece(player: Player) {
    return this.cells.filter(
      (cell) => cell.player === player && cell.isSquare
    )[0];
  }

  // プレイヤーの壁の数を取得する
  public getPlayerWalls(player: Player) {
    return this.walls[player === Player.PLAYER1 ? 0 : 1];
  }

  // 指定されたセルを取得する
  public getCell(position: Position) {
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

  // 盤面の状態をシリアライズする
  public serialize(): string {
    const cellsState = this.cells
      .map((cell) => {
        if (cell.player === Player.PLAYER1) return "1";
        if (cell.player === Player.PLAYER2) return "2";
        return "0";
      })
      .join("");

    return JSON.stringify({
      cells: cellsState,
      player: this.player,
      walls: this.walls,
    });
  }

  // シリアライズされた状態から盤面を再構築する
  public static deserialize(serialized: string): BoardState {
    const { cells: cellsState, player, walls } = JSON.parse(serialized);

    const cells = cellsState.split("").map((state: string, index: number) => {
      const x = index % Settings.BOARD_SIDE_LENGTH;
      const y = Math.floor(index / Settings.BOARD_SIDE_LENGTH);
      let cellPlayer = null;
      if (state === "1") cellPlayer = Player.PLAYER1;
      if (state === "2") cellPlayer = Player.PLAYER2;
      return new Cell(x, y, cellPlayer);
    });

    return new BoardState(cells, player, walls, [], -1);
  }

  // undo
  public undo() {
    if (!this.canUndo) return this;
    const newState = BoardState.deserialize(
      this.history[this.currentHistoryIndex - 1]
    );
    newState.history = this.history;
    newState.currentHistoryIndex = this.currentHistoryIndex - 1;
    return newState;
  }

  // redo
  public redo() {
    if (!this.canRedo) return this;
    const newState = BoardState.deserialize(
      this.history[this.currentHistoryIndex + 1]
    );
    newState.history = this.history;
    newState.currentHistoryIndex = this.currentHistoryIndex + 1;
    return newState;
  }
}
