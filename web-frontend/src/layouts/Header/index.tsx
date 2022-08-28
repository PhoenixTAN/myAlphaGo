import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import LogoPNG from "@Assets/logo.png";

import "./style.scss";

const Header = () => {
  return (
    <header className="layout-header">
      <Avatar alt="logo" src={LogoPNG} shape="square" size="large" />
      <div className="title">Go Engine</div>
      <Avatar className="profile-logo" icon={<UserOutlined />} />
    </header>
  );
};

export default Header;
