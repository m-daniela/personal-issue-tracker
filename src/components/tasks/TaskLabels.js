import React from "react";
import Chip from "@mui/material/Chip";
import { useTaskFilterContext } from "../context/TaskFilterProvider";
import { useRouter } from "next/navigation";
import { useSelectedProjectContext } from "../context/SelectedProjectProvider";
import { routes } from "@/utils/generalConstants";

/**
 * Simple task label
 * Display in the task preview and on the 
 * task page
 * If there is no label, return null
 * @param {string} label 
 * @returns 
 */
export const TaskLabelSimple = ({label}) => {
    const router = useRouter();
    const {selectedProject} = useSelectedProjectContext();
    const {query, setSearchString} = useTaskFilterContext();
    const handleLabelClick = (labelName) => (e) => {
        e.preventDefault();
        setSearchString({labels: [...query.labels, labelName]});
        router.push(routes.projectRoute(selectedProject.id));
    };
    if (!label){
        return null;
    }
    return (
        <Chip 
            label={label}
            onClick={handleLabelClick(label)}
        />
    );
};


/**
 * Deletable task label
 * Displayed only when updating the task
 * If there is no label, return null
 * @param {string} label
 * @param {function} handleDeleteLabel 
 * @returns 
 */
export const TaskLabelDeletable = ({label, handleDeleteLabel}) => {
    if (!label){
        return null;
    }
    return (
        <Chip
            label={label}
            onDelete={handleDeleteLabel(label)}
        />
    );
};
