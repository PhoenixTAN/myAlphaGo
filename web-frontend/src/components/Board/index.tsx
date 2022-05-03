import React, { useMemo } from "react";
import { BOARD_WIDTH, BOARD_HEIGHT } from "@Constants/index";
import "./style.scss";

const Board = () => {
  // 仅在首次渲染会new一个数组
  const rowArrayMemo = useMemo(() => {
    return new Array(BOARD_WIDTH).fill(undefined);
  }, []);

  const columnArrayMemo = useMemo(() => {
    return new Array(BOARD_HEIGHT).fill(undefined);
  }, []);

  const renderRowBox = () => {
    return (
      <div className="row-box">
        {rowArrayMemo.map(() => {
          return <div className="rows" />;
        })}
        {renderColumnBox()}
      </div>
    );
  };

  const renderColumnBox = () => {
    return (
      <div className="column-box">
        {columnArrayMemo.map(() => {
          return <div className="columns" />;
        })}
      </div>
    );
  };

  return <section className="board-container">{renderRowBox()}</section>;
};

export default Board;
