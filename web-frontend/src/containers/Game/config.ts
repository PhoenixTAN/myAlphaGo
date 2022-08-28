import { BOARD_WIDTH, BOARD_POSITION_STATE_ENUM } from "@Constants/index";

export const PIECE_RADIUS = 15; // 棋子半径
export const CELL_WIDTH = 40; // 格子宽度
export const CANVAS_SIZE = CELL_WIDTH * (BOARD_WIDTH - 1); // 帆布大小
export const BOARD_OFFSET = 20; // 棋盘在画布中的偏置

export const HORIZONTAL_COORDINATE_ARRAY = new Array(BOARD_WIDTH)
  .fill(undefined)
  .map((_: any, index: number) => {
    return index + 1;
  });

export const VERTICAL_COORDINATE_ARRAY = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
];

export const STAR_POSITION = [
  {
    x: 4,
    y: 4,
  },
  {
    x: 4,
    y: 10,
  },
  {
    x: 4,
    y: 16,
  },
  {
    x: 10,
    y: 4,
  },
  {
    x: 10,
    y: 10,
  },
  {
    x: 10,
    y: 16,
  },
  {
    x: 16,
    y: 4,
  },
  {
    x: 16,
    y: 10,
  },
  {
    x: 16,
    y: 16,
  },
];

export const GET_INITIAL_BOARD_STATE = (): Array<Array<number>> =>
  new Array(BOARD_WIDTH).fill(undefined).map(() => {
    return new Array(BOARD_WIDTH).fill(BOARD_POSITION_STATE_ENUM.NONE);
  });
