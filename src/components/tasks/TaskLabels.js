import React from "react";
import Chip from "@mui/material/Chip";


/**
 * Simple task label
 * Display in the task preview and on the 
 * task page
 * @param {string} label 
 * @returns 
 */
export const TaskLabelSimple = ({label}) => {
    return (
        <Chip label={label}/>
    );
};


/**
 * Deletable task label
 * Displayed only when updating the task
 * @param {string} label
 * @param {function} handleDeleteLabel 
 * @returns 
 */
export const TaskLabelDeletable = ({label, handleDeleteLabel}) => {
    return (
        <Chip
            label={label}
            onDelete={handleDeleteLabel(label)}
        />
    );
};
