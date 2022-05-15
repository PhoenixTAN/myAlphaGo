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

export enum GAME_ENGINE_ENUM {
  GO = 1,
  N_IN_A_ROW = 2,
}

/**
 * 五子棋常量
 */
export const HOW_MANY_IN_A_ROW = 5;

export const GAME_ENGINE_VALUE_LABEL_MAP = {
  [GAME_ENGINE_ENUM.GO]: "围棋",
  [GAME_ENGINE_ENUM.N_IN_A_ROW]: `${HOW_MANY_IN_A_ROW}子棋`,
};
