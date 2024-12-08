import React, { useState } from 'react';
import styles from "./QNAHeader.module.css"
import { Link } from 'react-router-dom';

function QNAHeader(){

    return(
        <div>
            <div className={styles.qnaHeaderdiv}>
                <strong className={styles.qnaHeaderQNA}>QNA</strong>
                <strong className={styles.qnaHeaderQNAM}><Link to="/" className={styles.qnaHeaderQNALink}>QNA관리</Link ></strong>
                <strong className={styles.qnaHeaderQNAM}><Link to="/" className={styles.qnaHeaderQNALink}>FAQ관리</Link></strong>
            </div>
            <hr />

         </div>
    );
}

export default QNAHeader;
