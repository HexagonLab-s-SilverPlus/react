import React, { useState } from 'react';
import styles from "./QNAHeader.module.css"
import { Link } from 'react-router-dom';

function QNAHeader({text}){

    return(
        <div>
            <div className={styles.qnaHeaderdiv}>
                <strong className={styles.qnaHeaderQNA}>{text}</strong>
                <div className={styles.qnaHeaderQNAMTransform}>
                    <strong className={styles.qnaHeaderQNAM}><Link to="/" className={styles.qnaHeaderQNALink}>QNA관리</Link ></strong>
                    <strong className={styles.qnaHeaderQNAM}><Link to="/" className={styles.qnaHeaderQNALink}>FAQ관리</Link></strong>
                </div>
            </div>
            <hr className={styles.qnaHr}/>
        </div>
    );
}

export default QNAHeader;
