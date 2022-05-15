export const BOARD_WIDTH = 19;

export type IBoardType = Array<Array<number>>;

export enum BOARD_POSITION_STATE_ENUM {
  NONE = 0,
  BLACK = 1,
  WHITE = 2,
}

export const BOARD_POSITION_STATE_ARRAY: Array<number> = [
  BOARD_POSITION_STATE_ENUM.NONE,
  BOARD_POSITION_STATE_ENUM.BLACK,
  BOARD_POSITION_STATE_ENUM.WHITE,
];
