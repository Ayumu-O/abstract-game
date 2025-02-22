import { Cell } from "./cell";
import { Player } from "./player";

export class BoardState {
  public candidates: Cell[];
  public winner: Player | null = null;

  constructor(public cells: Cell[]) {
    this.candidates = this.calcCandidates();
    this.winner = this.calcWinner();
  }

  public canPlace(cell: Cell) {
    return this.candidates.some((c) => c.equals(cell));
  }

  public static reset() {
    const initilaCells = [];
    for (let x = 0; x < 17; x++) {
      for (let y = 0; y < 17; y++) {
        let player = null;
        if (x === 8 && y === 0) {
          player = Player.PLAYER1;
        } else if (x === 8 && y === 16) {
          player = Player.PLAYER2;
        }
        initilaCells.push(new Cell(x, y, player));
      }
    }
    return new BoardState(initilaCells);
  }

  public movePiece(player: Player, to: Cell) {
    const newCells = this.cells.map((cell) => {
      if (cell.equals(to)) {
        return new Cell(cell.x, cell.y, player);
      } else if (cell.player === player && cell.isSquare) {
        return new Cell(cell.x, cell.y, null);
      } else {
        return cell;
      }
    });
    return new BoardState(newCells);
  }

  public placeWall(player: Player, to: Cell) {
    let newCells;
    if (to.isSpaceH) {
      newCells = this.cells.map((cell) => {
        if (
          cell.equals(to) ||
          cell.equals(new Cell(to.x + 1, to.y, null)) ||
          cell.equals(new Cell(to.x + 2, to.y, null))
        ) {
          return new Cell(cell.x, cell.y, player);
        } else {
          return cell;
        }
      });
    } else if (to.isSpaceV) {
      newCells = this.cells.map((cell) => {
        if (
          cell.equals(to) ||
          cell.equals(new Cell(to.x, to.y + 1, null)) ||
          cell.equals(new Cell(to.x, to.y + 2, null))
        ) {
          return new Cell(cell.x, cell.y, player);
        } else {
          return cell;
        }
      });
    } else {
      throw new Error("Invalid wall placement");
    }
    return new BoardState(newCells);
  }

  private calcCandidates(): Cell[] {
    return [];
  }

  private calcWinner() {
    return null;
  }
}
