import { message } from "antd";
import { cloneDeep } from "lodash";
import { commonRulesParamSchema } from "@Schema/index";
import {
  IBasicParams,
  isAlreadyOccupied,
  paramsValidator,
} from "@Utils/commonRules";

/**
 * 获得棋盘的下一个状态。当且仅当落子合法，才调用该方法。
 * @param board 棋盘
 * @param x 落子横坐标 例如 十六
 * @param y 落子纵坐标 例如 14
 * @param color 表示下一步谁落子。1表示黑棋，2表示白棋
 */
export const getNewBoardState = async (params: IBasicParams) => {
  await paramsValidator(commonRulesParamSchema, params);
  const { board, x, y, color } = params;
  const newBoard = cloneDeep(board);
  newBoard[x][y] = color;
  return newBoard;
};

/**
 * 判断这一步是否合法
 * @param board 棋盘
 * @param x 落子横坐标 例如 十六
 * @param y 落子纵坐标 例如 14
 * @param color 表示这一步谁落子。1表示黑棋，2表示白棋
 */
export const isLegalGo = async (params: IBasicParams) => {
  await paramsValidator(commonRulesParamSchema, params);
  const { board, x, y, color } = params;
  // 检查当前坐标是否已经有子
  if (isAlreadyOccupied(params)) {
    console.log("there");
    message.warning(`(${x},${y})已经有子了！`);
    return false;
  }

  // 禁止自杀
  // 判定方法：如果落子不能吃掉对方的子，且导致自己的子气绝，则判定为自杀

  // 打劫

  return true;
};
