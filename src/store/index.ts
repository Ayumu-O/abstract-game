import { atom } from "jotai";
import { BoardState } from "../domain/boardState";
import { Cell } from "../domain/cell";

export const boardStateAtom = atom<BoardState>(BoardState.reset());
export const cursoredCellAtom = atom<Cell | null>(null);
export const cursoredWallAtom = atom<Cell[] | null>(null);
export const serialAtom = atom<string>("");
export const openSidebarAtom = atom<boolean>(false);
