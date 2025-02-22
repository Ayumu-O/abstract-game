import { atom } from "jotai";
import { BoardState } from "../domain/boardState";
import { Cell } from "../domain/cell";
import { Player } from "../domain/player";

export const boardStateAtom = atom<BoardState>(BoardState.reset());
export const cursoredCellAtom = atom<Cell | null>(null);
export const currentPlayerAtom = atom<Player>(Player.PLAYER1);
