"use client";

import React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Snackbar component to show a message
 * @param {boolean} open 
 * @param {function} setOpen 
 * @param {string} message 
 * @returns 
 */
const SnackbarWrapper = ({open, setOpen, message}) => {
  
    const handleClose = (e, reason) => {
        // the event might not be triggered
        // but if it is, it might need to be
        // prevented
        if (e) e.preventDefault();
        if (reason === "clickaway") {
            setOpen(false);
            return;
        }
  
        setOpen(false);
    };
  
    const action = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );
  
    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={action}
            />
        </div>
    );
};

export default SnackbarWrapper;
