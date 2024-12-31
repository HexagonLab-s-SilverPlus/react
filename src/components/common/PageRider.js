import React, { useState } from "react";
import styles from "./PageRider.module.css";
import button from "../../assets/images/chatIcon.png";
import SpeechRecognitionModal from "./SpeechRecognitionModal";

const PageRider = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <img
                src={button}
                className={styles.floatingButton}
                onClick={handleButtonClick}
                alt="Floating Button"
            />
            {isModalOpen && <SpeechRecognitionModal onClose={closeModal} />}
        </>
    );
};

export default PageRider;
