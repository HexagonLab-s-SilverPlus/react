// /src/components/common/PageRider.js
import React from "react";
import styles from "./PageRider.module.css";
import button from "../../assets/images/chatIcon.png"

const PageRider = (onClick) => {
    return (
        <>
            <img src={button} className={styles.floatingButton} onClick={onClick}></img>
        </>
    );
};

export default PageRider;