import { Player } from "./player";
import { Settings } from "./settings";

export class PositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PositionError";
  }
}

export type Key = number;

export class Position {
  constructor(public readonly x: number, public readonly y: number) {
    if (
      x < 0 ||
      x >= Settings.BOARD_SIDE_LENGTH ||
      y < 0 ||
      y >= Settings.BOARD_SIDE_LENGTH
    ) {
      throw new PositionError(`Invalid position: (${x}, ${y})`);
    }
    this.x = x;
    this.y = y;
  }

  get key(): Key {
    return this.y * Settings.BOARD_SIDE_LENGTH + this.x;
  }

  equals(position: Position) {
    return this.x === position.x && this.y === position.y;
  }
}

export class Cell extends Position {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly player: Player | null
  ) {
    super(x, y);
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
}
