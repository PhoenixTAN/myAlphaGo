/**
 * 放一些通用规则
 */

import Joi from "joi";
import { message } from "antd";
import { BOARD_POSITION_STATE_ENUM } from "@Constants/index";

export interface IBasicParams {
  board: number[][];
  x: number;
  y: number;
  color: number;
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
  const { board, x, y, color } = params;
  if (board[x][y] !== BOARD_POSITION_STATE_ENUM.NONE) {
    console.log(`${x + 1}， ${y + 1} 已经有子`);
    return true;
  }
  return false;
};
