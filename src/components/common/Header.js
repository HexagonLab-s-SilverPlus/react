// src/components/sm/senior/common/SeniorNavBar.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
// css
import Styles from './Header.module.css';

const Header = () => {
  return (
    <nav className={Styles.navbar}>
      <Link to="/" className={Styles.navbarlogo}>
        실버플러스
      </Link>
    </nav>
  );
};

export default Header;
