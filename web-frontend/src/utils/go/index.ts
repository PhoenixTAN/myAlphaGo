import { cloneDeep } from "lodash";
import { commonRulesParamSchema } from "@Schema/index";
import {
  IBasicParams,
  IBasicReturn,
  ILegalGoReturn,
  isAlreadyOccupied,
  paramsValidator,
} from "@Utils/commonRules";
import { BOARD_WIDTH, BOARD_POSITION_STATE_ENUM } from "@Constants/index";

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

  const willKillEnemiesArray = willKillEnemies(params);
  console.log("isLegalGo willKillEnemies", willKillEnemiesArray);
  const enemyColor =
    color === BOARD_POSITION_STATE_ENUM.BLACK
      ? BOARD_POSITION_STATE_ENUM.WHITE
      : BOARD_POSITION_STATE_ENUM.BLACK;
  // 分别标记左右上下四个方向的死子
  const willDieFlagArray = new Array(BOARD_WIDTH)
    .fill(undefined)
    .map(() => new Array(BOARD_WIDTH).fill(false));
  // 左方向
  if (willKillEnemiesArray[0]) {
    kill({ board: newBoard, x, y: y - 1, color: enemyColor }, willDieFlagArray);
  }
  // 右方向
  if (willKillEnemiesArray[1]) {
    kill({ board: newBoard, x, y: y + 1, color: enemyColor }, willDieFlagArray);
  }
  // 上方向
  if (willKillEnemiesArray[2]) {
    kill({ board: newBoard, x: x - 1, y, color: enemyColor }, willDieFlagArray);
  }
  // 下方向
  if (willKillEnemiesArray[3]) {
    kill({ board: newBoard, x: x + 1, y, color: enemyColor }, willDieFlagArray);
  }

  console.log("willDieFlagArray", willDieFlagArray);

  // 清除死子
  for (let i = 0; i < willDieFlagArray.length; i++) {
    for (let j = 0; j < willDieFlagArray[i].length; j++) {
      if (willDieFlagArray[i][j]) {
        newBoard[i][j] = BOARD_POSITION_STATE_ENUM.NONE;
      }
    }
  }

  return { newBoard, isLegal: true };
};

/**
 * 判断这一步是否合法
 * @param board 棋盘
 * @param x 落子横坐标 例如 十六
 * @param y 落子纵坐标 例如 14
 * @param color 表示这一步谁落子。1表示黑棋，2表示白棋
 */
export const isLegalGo = (params: IBasicParams): ILegalGoReturn => {
  const { board, x, y, color } = params;
  // 检查当前坐标是否已经有子
  if (isAlreadyOccupied(params)) {
    return {
      isLegal: false,
      errorMessage: `(${x + 1}， ${y + 1}) 已经有子`,
    };
  }

  // 禁止自杀
  // 判定方法：如果落子不能吃掉对方的子，且导致自己的子气绝，则判定为自杀
  const willKillEnemiesArray = willKillEnemies(params);
  console.log("isLegalGo willKillEnemies", willKillEnemiesArray);
  let willKill = false;
  for (let i = 0; i < willKillEnemiesArray.length; i++) {
    if (willKillEnemiesArray[i]) {
      willKill = true;
      break;
    }
  }
  // 如果不能吃掉对方
  if (!willKill) {
    const newBoard = cloneDeep(board);
    newBoard[x][y] = color;
    const isSuicide = willDie({ ...params, board: newBoard });
    if (isSuicide) {
      return { isLegal: false, errorMessage: "不能自杀" };
    }
  }

  // 打劫，下了这一手，不能跟棋盘的上上个状态一致

  return { isLegal: true };
};

/**
 * 确定能杀棋后，标记哪些棋子会死亡
 * 与当前(x,y)连接的当前颜色的棋子都会死亡。
 * @param board
 * @param x
 * @param y
 * @param color
 */
export const kill = (
  params: IBasicParams,
  willDieFlagArray: Array<Array<boolean>>
): void => {
  const { board, x, y, color } = params;
  willDieFlagArray[x][y] = true;
  // 左方向
  if (
    y - 1 >= 0 &&
    board[x][y - 1] === color &&
    willDieFlagArray[x][y - 1] === false
  ) {
    // willDieFlagArray[x][y - 1] = true;
    kill({ ...params, y: y - 1 }, willDieFlagArray);
  }

  // 右方向
  if (
    y + 1 < BOARD_WIDTH &&
    board[x][y + 1] === color &&
    willDieFlagArray[x][y + 1] === false
  ) {
    // willDieFlagArray[x][y + 1] = true;
    kill({ ...params, y: y + 1 }, willDieFlagArray);
  }

  // 上方向
  if (
    x - 1 >= 0 &&
    board[x - 1][y] === color &&
    willDieFlagArray[x - 1][y] === false
  ) {
    // willDieFlagArray[x - 1][y] = true;
    kill({ ...params, x: x - 1 }, willDieFlagArray);
  }

  // 下方向
  if (
    x + 1 < BOARD_WIDTH &&
    board[x + 1][y] === color &&
    willDieFlagArray[x + 1][y] === false
  ) {
    // willDieFlagArray[x + 1][y] = true;
    kill({ ...params, x: x + 1 }, willDieFlagArray);
  }
};

/**
 * 判断某块棋子是否气绝。
 * 我们反过来判断，只要连着的棋子，隔壁有一口气，就表明不会死。
 * @param board
 * @param x
 * @param y
 * @param color 当前这种颜色的棋子会不会死
 */
export const willDie = (params: IBasicParams): boolean => {
  // 需要一个新数组，标记什么地方已经被搜索过
  const flag = new Array(BOARD_WIDTH)
    .fill(undefined)
    .map(() => new Array(BOARD_WIDTH).fill(false));

  const nonePosition = BOARD_POSITION_STATE_ENUM.NONE;

  const hasOxygenRecursion = (params: IBasicParams): boolean => {
    const { board, x, y, color } = params;
    // 判断上下左右是否有气，有气就返回true
    // 左方向
    if (y - 1 >= 0 && board[x][y - 1] === nonePosition) {
      return true;
    }

    // 右方向
    if (y + 1 < BOARD_WIDTH && board[x][y + 1] === nonePosition) {
      return true;
    }

    // 上方向
    if (x - 1 >= 0 && board[x - 1][y] === nonePosition) {
      return true;
    }

    // 下方向
    if (x + 1 < BOARD_WIDTH && board[x + 1][y] === nonePosition) {
      return true;
    }

    // 标记当前位置已经被搜索过了
    flag[x][y] = true;

    // 接下来就得开始dfs了
    let hasOxygen = false;
    // 左方向，不是边界，而且是自己的棋子，而且没有被遍历过
    if (y - 1 >= 0 && board[x][y - 1] === color && flag[x][y - 1] === false) {
      hasOxygen = hasOxygenRecursion({ ...params, y: y - 1 });
      if (hasOxygen) {
        return true;
      }
    }

    // 右方向
    if (
      y + 1 < BOARD_WIDTH &&
      board[x][y + 1] === color &&
      flag[x][y + 1] === false
    ) {
      hasOxygen = hasOxygenRecursion({ ...params, y: y + 1 });
      if (hasOxygen) {
        return true;
      }
    }

    // 上方向
    if (x - 1 >= 0 && board[x - 1][y] === color && flag[x - 1][y] === false) {
      hasOxygen = hasOxygenRecursion({ ...params, x: x - 1 });
      if (hasOxygen) {
        return true;
      }
    }

    // 下方向
    if (
      x + 1 < BOARD_WIDTH &&
      board[x + 1][y] === color &&
      flag[x + 1][y] === false
    ) {
      hasOxygen = hasOxygenRecursion({ ...params, x: x + 1 });
      if (hasOxygen) {
        return true;
      }
    }

    return false;
  };

  const hasOxygenResult = hasOxygenRecursion(params);

  if (hasOxygenResult) {
    return false;
  }

  return true;
};

/**
 * 判断当前落子是否会杀掉敌方棋子
 * 已经进行参数校验。
 * @param board
 * @param x
 * @param y
 * @param color 表示这一步棋会不会杀掉对手。
 * @return Array<boolean>: [left, right, up ,down] 因为有可能杀掉四块棋子，上下左右四个方向
 */
export const willKillEnemies = (params: IBasicParams): Array<boolean> => {
  // 先判断当前落子上下左右四个方向，是否跟敌方棋子接触
  // 只有跟敌方接触，才有可能产生杀棋

  const { board, x, y, color } = params;
  const enemyColor =
    color === BOARD_POSITION_STATE_ENUM.BLACK
      ? BOARD_POSITION_STATE_ENUM.WHITE
      : BOARD_POSITION_STATE_ENUM.BLACK;

  const willKill = new Array(4);
  willKill.fill(false);

  const deepCloneBoard = cloneDeep(board);
  // 得先把棋子下下去，再判断死活
  deepCloneBoard[x][y] = color;

  // 左方向
  if (y - 1 >= 0 && board[x][y - 1] === enemyColor) {
    willKill[0] = willDie({
      board: deepCloneBoard,
      x,
      y: y - 1,
      color: enemyColor,
    });
  }

  // 右方向
  if (y + 1 < BOARD_WIDTH && board[x][y + 1] === enemyColor) {
    willKill[1] = willDie({
      board: deepCloneBoard,
      x,
      y: y + 1,
      color: enemyColor,
    });
  }

  // 上方向
  if (x - 1 >= 0 && board[x - 1][y] === enemyColor) {
    willKill[2] = willDie({
      board: deepCloneBoard,
      x: x - 1,
      y,
      color: enemyColor,
    });
  }

  // 下方向
  if (x + 1 < BOARD_WIDTH && board[x + 1][y] === enemyColor) {
    willKill[3] = willDie({
      board: deepCloneBoard,
      x: x + 1,
      y,
      color: enemyColor,
    });
  }

  return willKill;
};
