"use client";

import DisplayError from "@/components/utils/DisplayError";
import React from "react";

const Error = ({error, reset}) => {
    return <DisplayError error={error} reset={reset}/>;
};

export default Error;
