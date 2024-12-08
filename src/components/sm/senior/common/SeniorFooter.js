// src/components/sm/senior/common/SeniorFooter.js
import React,{useState, useEffect} from "react";
import Styles from "./SeniorFooter.module.css"

const SeniorFooter = () => {
    return (
        <footer className={Styles.footer}>
            <div className={Styles.context}>
                © 2024. Silver Plus Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default SeniorFooter;