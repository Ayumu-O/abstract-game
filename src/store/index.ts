import { atom } from "jotai";
import { BoardState } from "../domain/boardState";
import { Candidates } from "../domain/candidates";
import { Cell } from "../domain/cell";

export const boardStateAtom = atom<BoardState>(BoardState.reset());
export const candidatesAtom = atom<Candidates>(new Candidates([]));
export const cursoredCellAtom = atom<Cell | null>(null);
export const cursoredWallAtom = atom<Cell[] | null>(null);
export const serialAtom = atom<string>("");
export const openSidebarAtom = atom<boolean>(false);
