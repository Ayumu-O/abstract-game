import { Player } from "./player";

export class Cell {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly player: Player | null
  ) {}

  get key() {
    return this.y * 17 + this.x;
  }

  get isSquare() {
    return this.x % 2 === 0 && this.y % 2 === 0;
  }

  get isSpaceV() {
    return this.x % 2 !== 0 && this.y % 2 === 0;
  }

  get isSpaceH() {
    return this.x % 2 === 0 && this.y % 2 !== 0;
  }

  get isSpaceCross() {
    return this.x % 2 !== 0 && this.y % 2 !== 0;
  }

  equals(cell: Cell) {
    return this.x === cell.x && this.y === cell.y;
  }
}
