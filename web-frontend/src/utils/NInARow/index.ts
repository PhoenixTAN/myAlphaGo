import { cloneDeep } from "lodash";
import {
  IBasicParams,
  IBasicReturn,
  ILegalGoReturn,
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
): Promise<IBasicReturn & ILegalGoReturn> => {
  await paramsValidator(commonRulesParamSchema, params);
  const { isLegal, errorMessage } = isLegalGo(params);
  if (!isLegal) {
    return {
      newBoard: null,
      isLegal,
      errorMessage,
    };
  }
  const { board, x, y, color } = params;
  const newBoard = cloneDeep(board);
  newBoard[x][y] = color;
  return { newBoard, isLegal: true };
};

export const isLegalGo = (params: IBasicParams) => {
  const { board, x, y, color } = params;
  // 检查当前坐标是否已经有子
  if (isAlreadyOccupied(params)) {
    return {
      isLegal: false,
      errorMessage: `(${x + 1}， ${y + 1}) 已经有子`,
    };
  }
  return { isLegal: true };
};
