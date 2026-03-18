"use client";

import React from "react";
import {LoadingContainer} from "@/components/Loading/Loading.styles.js";

const LoadingContent = () => {
    return (
        <LoadingContainer>
            <div className="lds-ring">
                <div />
                <div />
                <div />
                <div />
            </div>
        </LoadingContainer>
    );
};

export default LoadingContent;
