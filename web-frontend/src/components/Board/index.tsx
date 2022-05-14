import React, { useEffect, useMemo, useCallback, useState } from "react";
import { debounce, cloneDeep } from "lodash";
import { message } from "antd";
import { BOARD_WIDTH, BOARD_POSITION_STATE_ENUM } from "@Constants/index";
import {
  CANVAS_SIZE,
  CELL_WIDTH,
  HORIZONTAL_COORDINATE_ARRAY,
  VERTICAL_COORDINATE_ARRAY,
  STAR_POSITION,
  INITIAL_BOARD_STATE,
  PIECE_RADIUS,
  BOARD_OFFSET,
} from "./config";
import { getNewBoardState } from "@Utils/go";
import "./style.scss";

const BOARD_CANVAS_ID = "board-canvas";

const Board = () => {
  const [hands, setHands] = useState(0);
  const [boardState, setBoardState] = useState<number[][]>(INITIAL_BOARD_STATE);
  const [hoveringLocation, setHoveringLocation] = useState();

  const go = async (x: number, y: number) => {
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
      setHands(hands + 1);
      drawPieces();
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
  const handleCanvasMouseMove = useCallback(
    debounce((event) => {
      const { nativeEvent } = event;
      const { offsetX, offsetY } = nativeEvent;
      console.log("offsetX, offsetY", offsetX, offsetY);
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
