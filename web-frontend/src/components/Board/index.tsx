import React, { useEffect, useMemo, useCallback, useState, FC } from "react";
import { cloneDeep } from "lodash";
import { Button, message, Popconfirm } from "antd";
import {
  BOARD_WIDTH,
  BOARD_POSITION_STATE_ENUM,
  IBoardType,
  GAME_ENGINE_ENUM,
} from "@Constants/index";
import { IBasicParams } from "@Utils/commonRules";
import {
  CANVAS_SIZE,
  CELL_WIDTH,
  HORIZONTAL_COORDINATE_ARRAY,
  VERTICAL_COORDINATE_ARRAY,
  STAR_POSITION,
  GET_INITIAL_BOARD_STATE,
  PIECE_RADIUS,
  BOARD_OFFSET,
} from "./config";
import { getNewBoardState as getNewBoardStateByGoEngine } from "@Utils/go";
import { getNewBoardState as getNewBoardStateByNInARowEngine } from "@Utils/NInARow";
import {
  getBoardStateByIndex,
  stackPop,
  stackPush,
} from "@Utils/BoardStateQueue";
import "./style.scss";

const BOARD_CANVAS_ID = "board-canvas";

export interface IBoardParams {
  gameEngine: number;
}

const Board: FC<IBoardParams> = ({ gameEngine }) => {
  const [boardState, setBoardState] = useState<IBoardType>(
    GET_INITIAL_BOARD_STATE()
  );
  // 操作boardState必须用封装好的函数
  const [boardStateStack, setBoardStateStack] = useState<Array<IBoardType>>([]);

  const getNewBoardState = useCallback(
    (params: IBasicParams) => {
      switch (gameEngine) {
        case GAME_ENGINE_ENUM.GO:
          return getNewBoardStateByGoEngine(params);
        case GAME_ENGINE_ENUM.N_IN_A_ROW:
          return getNewBoardStateByNInARowEngine(params);
        default:
          throw new Error("No such engine");
      }
    },
    [gameEngine]
  );

  /*
   * x, y在此处就是从0到18
   * 以左上角为坐标原点，从上往下作为x轴，从左往右作为y轴
   * @param x
   * @param y
   * (0,0) (0,1) (0,2) ... (0,18)
   * (1,0) (1,1) (1,2) ... (1,18)
   *  ...                   ...
   * (18,0) ...            (18,18)
   */
  const go = async (x: number, y: number) => {
    console.log("go", "x", x, "y", y);
    const hands = boardStateStack.length;
    const params = {
      board: cloneDeep(boardState),
      x,
      y,
      color:
        hands % 2 === 0
          ? BOARD_POSITION_STATE_ENUM.BLACK
          : BOARD_POSITION_STATE_ENUM.WHITE,
    };

    const { newBoard, isLegal, errorMessage } = await getNewBoardState(params);
    if (!!newBoard && isLegal) {
      clearCanvas();
      drawBoard();
      // 设置棋盘状态
      console.log("newBoard", newBoard);
      setBoardState(cloneDeep(newBoard));
      setBoardStateStack(stackPush(boardStateStack, cloneDeep(newBoard)));
    } else {
      message.warning(errorMessage);
    }
  };

  // 画出棋子
  const drawPieces = () => {
    const boardCanvas = document.getElementById(
      BOARD_CANVAS_ID
    ) as HTMLCanvasElement;
    const boardCanvasContext = boardCanvas.getContext("2d");
    for (let i = 0; i < boardState.length; i++) {
      for (let j = 0; j < boardState[i].length; j++) {
        const strokeTargetX = j * CELL_WIDTH + BOARD_OFFSET;
        const strokeTargetY = i * CELL_WIDTH + BOARD_OFFSET;
        boardCanvasContext.moveTo(strokeTargetX, strokeTargetY);
        if (boardState[i][j] === BOARD_POSITION_STATE_ENUM.BLACK) {
          boardCanvasContext.strokeStyle = "#333";
          boardCanvasContext.fillStyle = "#333";
          boardCanvasContext.beginPath();
          boardCanvasContext.arc(
            strokeTargetX, // center x
            strokeTargetY, // center y
            PIECE_RADIUS, // radius
            0, // start angle
            2 * Math.PI // end angel
          );
          boardCanvasContext.fill();
        } else if (boardState[i][j] === BOARD_POSITION_STATE_ENUM.WHITE) {
          boardCanvasContext.strokeStyle = "#fff";
          boardCanvasContext.fillStyle = "#fff";
          boardCanvasContext.beginPath();
          boardCanvasContext.arc(
            strokeTargetX, // center x
            strokeTargetY, // center y
            PIECE_RADIUS, // radius
            0, // start angle
            2 * Math.PI // end angel
          );
          boardCanvasContext.fill();
        }
      }
    }
  };

  const clearCanvas = useCallback(() => {
    const boardCanvas = document.getElementById(
      BOARD_CANVAS_ID
    ) as HTMLCanvasElement;
    const boardCanvasContext = boardCanvas.getContext("2d");
    boardCanvasContext.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
  }, []);

  const drawBoard = useCallback(() => {
    const boardCanvas = document.getElementById(
      BOARD_CANVAS_ID
    ) as HTMLCanvasElement;

    boardCanvas.width = CANVAS_SIZE + 2 * BOARD_OFFSET;
    boardCanvas.height = CANVAS_SIZE + 2 * BOARD_OFFSET;
    const boardCanvasContext = boardCanvas.getContext("2d");
    boardCanvasContext.strokeStyle = "#333";
    boardCanvasContext.lineWidth = 2;

    // 画竖线
    for (let i = 0; i < BOARD_WIDTH; i++) {
      boardCanvasContext.moveTo(i * CELL_WIDTH + BOARD_OFFSET, BOARD_OFFSET);
      boardCanvasContext.lineTo(
        i * CELL_WIDTH + BOARD_OFFSET,
        CANVAS_SIZE + BOARD_OFFSET
      );
      boardCanvasContext.stroke();
    }
    // 画横线
    for (let i = 0; i < BOARD_WIDTH; i++) {
      boardCanvasContext.moveTo(BOARD_OFFSET, i * CELL_WIDTH + BOARD_OFFSET);
      boardCanvasContext.lineTo(
        CANVAS_SIZE + BOARD_OFFSET,
        i * CELL_WIDTH + BOARD_OFFSET
      );
      boardCanvasContext.stroke();
    }

    // 画星位天元
    STAR_POSITION.map(({ x: canvasY, y: canvasX }) => {
      boardCanvasContext.moveTo(
        (canvasX - 1) * CELL_WIDTH + BOARD_OFFSET,
        (canvasY - 1) * CELL_WIDTH + BOARD_OFFSET
      );
      boardCanvasContext.beginPath();
      boardCanvasContext.arc(
        (canvasX - 1) * CELL_WIDTH + BOARD_OFFSET, // center x
        (canvasY - 1) * CELL_WIDTH + BOARD_OFFSET, // center y
        2, // radius
        0, // start angle
        2 * Math.PI // end angel
      );
      boardCanvasContext.stroke();
    });
  }, []);

  useEffect(() => {
    drawBoard();
  }, []);

  useEffect(() => {
    drawPieces();
  }, [boardState]);

  // 画刻度，水平方向
  const renderCoordinateHorizontalTop = useMemo(() => {
    return (
      <div className="coordinate horizontal-top" style={{ width: CANVAS_SIZE }}>
        {HORIZONTAL_COORDINATE_ARRAY.map((number) => {
          return <span key={number}>{number}</span>;
        })}
      </div>
    );
  }, []);

  // 画刻度，竖直方向
  const renderCoordinateVerticalLeft = useMemo(() => {
    return (
      <div className="coordinate vertical-left">
        {VERTICAL_COORDINATE_ARRAY.map((number) => {
          return <span key={number}>{number}</span>;
        })}
      </div>
    );
  }, []);

  // 落子坐标计算
  const handleCanvasOnClick = (event) => {
    const { nativeEvent } = event;
    const { offsetX, offsetY } = nativeEvent;
    console.log("offsetX, offsetY", offsetX, offsetY);
    // 计算坐标
    const x = Math.round((offsetY - BOARD_OFFSET) / CELL_WIDTH);
    const y = Math.round((offsetX - BOARD_OFFSET) / CELL_WIDTH);
    console.log(
      `落子 人类坐标： ${x + 1}, ${y + 1}`,
      `${VERTICAL_COORDINATE_ARRAY[x]}之${y + 1}`
    );
    go(x, y);
  };

  // hover坐标计算
  // const handleCanvasMouseMove = useCallback(
  //   debounce((event) => {
  //     const { nativeEvent } = event;
  //     const { offsetX, offsetY } = nativeEvent;
  //     console.log("offsetX, offsetY", offsetX, offsetY);
  //   }, 100),
  //   []
  // );

  const handleUndoLastGo = () => {
    if (boardStateStack.length === 0) {
      message.warning("无棋可悔");
      return;
    }
    // 第一步棋 edge case
    let lastBoardState = null;
    let lastBoardStateStack = null;
    if (boardStateStack.length === 1) {
      lastBoardState = GET_INITIAL_BOARD_STATE();
      lastBoardStateStack = [];
    } else {
      lastBoardStateStack = stackPop(boardStateStack);
      lastBoardState = getBoardStateByIndex(
        lastBoardStateStack,
        lastBoardStateStack.length - 1
      );
    }

    console.log("lastBoardState", lastBoardState);
    console.log("lastBoardStateStack", lastBoardStateStack);
    clearCanvas();
    drawBoard();
    setBoardState(lastBoardState);
    setBoardStateStack(lastBoardStateStack);
  };

  const renderFooter = () => {
    return (
      <footer className="footer">
        <Popconfirm
          placement="top"
          title="确认悔棋吗？"
          onConfirm={handleUndoLastGo}
          okText="悔棋"
          cancelText="取消"
        >
          <Button type="primary">悔棋</Button>
        </Popconfirm>
      </footer>
    );
  };

  return (
    <section className="board-section">
      <div className="board-container">
        {renderCoordinateHorizontalTop}
        {renderCoordinateVerticalLeft}
        <canvas
          id={BOARD_CANVAS_ID}
          className={BOARD_CANVAS_ID}
          onClick={handleCanvasOnClick}
          // onMouseMove={handleCanvasMouseMove}
        />
      </div>
      {renderFooter()}
    </section>
  );
};

export default Board;
