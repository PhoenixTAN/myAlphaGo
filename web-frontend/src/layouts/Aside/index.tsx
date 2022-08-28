import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";

import "./style.scss";

const Aside = () => {
  const history = useHistory();

  const items = [
    { label: "首页", key: "home", onClick: () => {} },
    {
      label: "单机对局",
      key: "self-play-game",
      onClick: () => {
        history.push("/game");
      },
    },
    { label: "人机对局", key: "human-ai-game", disabled: true },
    { label: "机器对局", key: "ai-ai-game", disabled: true },
    { label: "联机对局", key: "human-online-game", disabled: true },
  ];

  const [collapsedSider, setCollapsedSider] = useState(false);

  return (
    <Menu
      className="aside-menu"
      defaultSelectedKeys={["home"]}
      items={items}
      theme="light"
      mode="inline"
      //   inlineCollapsed={true}
    />
  );
};

export default Aside;
