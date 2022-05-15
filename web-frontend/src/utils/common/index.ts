/**
 * 放一些通用规则
 */
import Joi from "joi";
import { message } from "antd";
import { BOARD_POSITION_STATE_ENUM, IBoardType } from "@Constants/index";

export interface IBasicParams {
  board: number[][];
  x: number;
  y: number;
  color: number;
}

export interface IBasicReturn {
  newBoard: number[][];
}

export interface ILegalGoReturn {
  isLegal: boolean;
  errorMessage?: string;
}

export const paramsValidator = async (schema: Joi.AnySchema, params: any) => {
  try {
    await schema.validateAsync(params);
  } catch (err) {
    console.error("paramsValidator", err);
    message.error(err);
  }
};

/**
 * 判断这个位置是否已经有棋子
 * 已经进行参数校验。
 * @param board
 * @param x
 * @param y
 * @param color
 */
export const isAlreadyOccupied = (params: IBasicParams) => {
  const { board, x, y } = params;
  if (board[x][y] !== BOARD_POSITION_STATE_ENUM.NONE) {
    console.log(`${x + 1}， ${y + 1} 已经有子`);
    return true;
  }
  return false;
};

/**
 * 判断两个棋盘状态是不是同一个
 * @param board1 
 * @param board2 
 * @returns 
 */
export const isSameBoardState = (
  board1: IBoardType,
  board2: IBoardType
): boolean => {
  for(let i = 0; i < board1.length; i++ ) {
    for( let j = 0; j < board1[i].length; j++ ) {
      if(board1[i][j] !== board2[i][j]) {
        return false;
      }
    }
  }
  return true;
};