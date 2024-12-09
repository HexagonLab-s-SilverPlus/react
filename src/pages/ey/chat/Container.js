// src/components/Container.js
import React from "react";
import PropTypes from "prop-types";
import styles from "./Container.module.css";

const Container = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

// PropTypes 정의
Container.propTypes = {
  children: PropTypes.node.isRequired, // children은 React 노드로 정의하고 필수로 지정
};

export default Container;
