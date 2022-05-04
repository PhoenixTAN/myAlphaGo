import React, { useEffect, useMemo, useCallback, useState } from "react";
import { debounce, cloneDeep } from "lodash";
import { BOARD_WIDTH, BOARD_POSITION_STATE_ENUM } from "@Constants/index";
import {
  CANVAS_SIZE,
  CELL_WIDTH,
  HORIZONTAL_COORDINATE_ARRAY,
  VERTICAL_COORDINATE_ARRAY,
  STAR_POSITION,
  INITIAL_BOARD_STATE,
  PIECE_RADIUS,
} from "./config";
import "./style.scss";

const BOARD_CANVAS_ID = "board-canvas";

const Board = () => {
  const [hands, setHands] = useState(0);
  const [boardState, setBoardState] = useState<number[][]>(INITIAL_BOARD_STATE);
  const [hoveringLocation, setHoveringLocation] = useState();

  // 当且仅当落子合法，才调用该方法
  const getNewBoardState = (x: number, y: number) => {
    const currentBoardState = cloneDeep(boardState);
    if (hands % 2 === 0) {
      // 当前是轮到黑子落子
      currentBoardState[x][y] = BOARD_POSITION_STATE_ENUM.BLACK;
    } else {
      // 轮到白子落子
      currentBoardState[x][y] = BOARD_POSITION_STATE_ENUM.WHITE;
    }
    return currentBoardState;
  };

  // 判断落子是否合法
  const isLegalGo = (x: number, y: number): boolean => {
    // 检查当前坐标是否已经有子

    if (boardState[x][y] !== BOARD_POSITION_STATE_ENUM.NONE) {
      console.log(`${x + 1}， ${y + 1} 已经有子`);
      return false;
    }

    return true;
  };

  const go = (x: number, y: number) => {
    if (isLegalGo(x, y)) {
      clearCanvas();
      drawBoard();
      const newBoardState = getNewBoardState(x, y);
      // 设置棋盘状态
      console.log("newBoardState", newBoardState);
      setBoardState(newBoardState);
      setHands(hands + 1);
      drawPieces();
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
        boardCanvasContext.moveTo(j * CELL_WIDTH, i * CELL_WIDTH);
        if (boardState[i][j] === BOARD_POSITION_STATE_ENUM.BLACK) {
          boardCanvasContext.strokeStyle = "#333";
          boardCanvasContext.fillStyle = "#333";
          boardCanvasContext.beginPath();
          boardCanvasContext.arc(
            j * CELL_WIDTH, // center x
            i * CELL_WIDTH, // center y
            PIECE_RADIUS, // radius
            0, // start angle
            2 * Math.PI // end angel
          );
          boardCanvasContext.fill();
        } else if (boardState[i][j] === BOARD_POSITION_STATE_ENUM.WHITE) {
          console.log("white");
          boardCanvasContext.strokeStyle = "#fff";
          boardCanvasContext.fillStyle = "#fff";
          boardCanvasContext.beginPath();
          boardCanvasContext.arc(
            j * CELL_WIDTH, // center x
            i * CELL_WIDTH, // center y
            PIECE_RADIUS, // radius
            0, // start angle
            2 * Math.PI // end angel
          );
          
          console.log(
            "boardCanvasContext.fillStyle",
            boardCanvasContext.fillStyle
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

    boardCanvas.width = CANVAS_SIZE + 10;
    boardCanvas.height = CANVAS_SIZE + 10;
    const boardCanvasContext = boardCanvas.getContext("2d");
    boardCanvasContext.strokeStyle = "#333";
    boardCanvasContext.lineWidth = 2;

    // 画竖线
    for (let i = 0; i < BOARD_WIDTH; i++) {
      boardCanvasContext.moveTo(i * CELL_WIDTH, 1);
      boardCanvasContext.lineTo(i * CELL_WIDTH, CANVAS_SIZE);
      boardCanvasContext.stroke();
    }
    // 画横线
    for (let i = 0; i < BOARD_WIDTH; i++) {
      boardCanvasContext.moveTo(1, i * CELL_WIDTH);
      boardCanvasContext.lineTo(CANVAS_SIZE, i * CELL_WIDTH);
      boardCanvasContext.stroke();
    }

    // 画星位天元
    STAR_POSITION.map(({ x: canvasY, y: canvasX }) => {
      boardCanvasContext.moveTo(
        (canvasX - 1) * CELL_WIDTH,
        (canvasY - 1) * CELL_WIDTH
      );
      boardCanvasContext.beginPath();
      boardCanvasContext.arc(
        (canvasX - 1) * CELL_WIDTH, // center x
        (canvasY - 1) * CELL_WIDTH, // center y
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
    // 计算人类坐标
    const x = Math.round(offsetY / CELL_WIDTH);
    const y = Math.round(offsetX / CELL_WIDTH);
    console.log(
      `落子 人类坐标： ${x + 1}, ${y + 1}`,
      `${VERTICAL_COORDINATE_ARRAY[x]}之${y + 1}`
    );
    go(x, y);
  };

  // hover坐标计算
  const handleCanvasMouseMove = useCallback(
    debounce((event) => {
      const { nativeEvent } = event;
      const { offsetX, offsetY } = nativeEvent;
      console.log("offsetX, offsetY", offsetX, offsetY);
      // 计算人类坐标
      const x = Math.round(offsetY / CELL_WIDTH);
      const y = Math.round(offsetX / CELL_WIDTH);
      console.log(
        `Hover 人类坐标： ${x + 1}, ${y + 1}`,
        `${VERTICAL_COORDINATE_ARRAY[x]}之${y + 1}`
      );
    }, 100),
    []
  );

  return (
    <section className="board-container">
      {renderCoordinateHorizontalTop}
      {renderCoordinateVerticalLeft}
      <canvas
        id={BOARD_CANVAS_ID}
        className={BOARD_CANVAS_ID}
        onClick={handleCanvasOnClick}
        onMouseMove={handleCanvasMouseMove}
      />
    </section>
  );
};

export default Board;
