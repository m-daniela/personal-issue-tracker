"use client";

import React from "react";

/**
 * Error component, displays the message and
 * the "Try again" button, linked to the reset 
 * function
 * @param {object} error 
 * @param {function} reset 
 * @returns 
 */
const DisplayError = ({error, reset}) => {
    return (
        <section className="error">
            <p className="highlighted">Something went wrong...</p>
            <h2>{error.message}</h2>
            <p>An error has occured while fetching this resource. 
                Check if the data is correct and try again.</p>
            <div>
                <button className="primary" onClick={reset}>Try again</button>
            </div>
        </section>
    );
};

export default DisplayError;