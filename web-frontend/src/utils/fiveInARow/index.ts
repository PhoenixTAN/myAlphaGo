import { cloneDeep } from "lodash";
import {
  IBasicParams,
  isAlreadyOccupied,
  paramsValidator,
} from "@Utils/commonRules";
import { commonRulesParamSchema } from "@Schema/index";
import { BOARD_POSITION_STATE_ENUM } from "@Constants/index";
import { message } from "antd";

/**
 * 获得棋盘的下一个状态。当且仅当落子合法，才调用该方法。
 * @param board 棋盘
 * @param x 落子横坐标 例如 十六
 * @param y 落子纵坐标 例如 14
 * @param color 表示下一步谁落子。1表示黑棋，2表示白棋
 */
export const getNewBoardState = async (
  params: IBasicParams
): Promise<Array<Array<number>> | null> => {
  await paramsValidator(commonRulesParamSchema, params);
  if (!isLegalGo(params)) {
    return null;
  }
  const { board, x, y, color } = params;
  const newBoard = cloneDeep(board);
  newBoard[x][y] = color;
  return newBoard;
};

export const isLegalGo = (params: IBasicParams) => {
  const { board, x, y, color } = params;
  // 检查当前坐标是否已经有子
  if (isAlreadyOccupied(params)) {
    return false;
  }
  return true;
};
