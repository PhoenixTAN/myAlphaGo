import { message } from "antd";
import { cloneDeep } from "lodash";
import { IBoardType } from "@Constants/index";

export const stackPush = (
  stack: Array<IBoardType>,
  newBoard: IBoardType
): Array<IBoardType> => {
  const newStack = cloneDeep(stack);
  newStack.push(newBoard);
  return newStack;
};

export const stackPop = (stack: Array<IBoardType>): Array<IBoardType> => {
  const newStack = cloneDeep(stack);
  newStack.pop();
  return newStack;
};

export const getBoardStateByIndex = (
  stack: Array<IBoardType>,
  index: number
):  IBoardType => {
  if (index < 0 || index >= stack.length) {
    message.error(
      `getBoardStateByIndex数组越界: index=${index} queue.length=${stack.length}`
    );
    throw new Error(
      `getBoardStateByIndex数组越界: index=${index} queue.length=${stack.length}`
    );
  }
  return cloneDeep(stack[index]);
};
