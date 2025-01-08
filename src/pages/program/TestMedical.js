// src/pages/program/TestMedical.js
import React from "react";
import { AuthContext } from "../../AuthProvider";
import { apiSpringBoot } from "../../utils/axios";
import Medical from "../../components/medical/Medical";

const TestMedical = () => {
    return (
        <div>
            <Medical />
        </div>
    );
};

export default TestMedical;