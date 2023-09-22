"use client";

import { updateTask } from "@/redux/features/categoriesSlice";
import { apiUrls } from "@/utils/generalConstants";
import React, {useState} from "react";
import { useDispatch } from "react-redux";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PageHeader from "../PageHeader";
import SnackbarWrapper from "../SnackbarWrapper";
import { TaskLabelSimple, TaskLabelDeletable } from "./TaskLabels";


/**
 * Task component
 * Used to display the task data and
 * to switch to update mode
 * This page will also have the "move
 * to category" feature until I add 
 * the drag and drop option in the 
 * project page
 * TODO: set labels
 * TODO: see why it doesn't update when going 
 * TODO: back to the project page
 * @param {string} projectId 
 * @param {string} categoryId 
 * @param {object} taskData 
 * @returns 
 */
const Task = ({projectId, categoryId, taskData}) => {
    const dispatch = useDispatch();
    const [updateOn, setUpdateOn] = useState(false);
    const [task, setTask] = useState(taskData);
    const [open, setOpen] = useState(true);
    const [label, setLabel] = useState("");
    const [message, setMessage] = useState({
        text: "", 
        isError: false
    });

    console.log(task);

    const handleOnClose = (e) => {
        e.preventDefault();
        setTask(taskData);
        setUpdateOn(false);
    };

    const handleOnChange = (e) => {
        e.preventDefault();
        setTask(state => {
            return {
                ...state,
                [e.target.id]: e.target.value
            };});
    };

    const handleDeleteLabel = (labelName) => () => {
        console.log(labelName);
        setTask(state => {
            return {
                ...state, 
                labels: state.labels.filter(label => label !== labelName)
            };
        });
    };

    const handleAddLabel = (e) => {
        e.preventDefault();
        setTask(state => {
            return {
                ...state, 
                labels: [...state.labels, label]
            };
        });
        setLabel("");
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        const response = await fetch(
            apiUrls.updateTask(projectId, categoryId, taskData.id), 
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(task)
            });
        const updatedtask = await response.json();
        if (updatedtask.error) {
            setMessage({
                text: `Error while updating the task: ${updatedtask.error.message}`, 
                isError: true
            });
            setOpen(true);
        }
        else{
            setMessage({
                text: "", 
                isError: false
            });
            setOpen(false);
            dispatch(updateTask({task: updatedtask}));
            setUpdateOn(state => !state);
        }
    };

    return (
        <>
            <section className="task">
                {
                    updateOn ? 
                        <>
                            <PageHeader title="Update the task" />
                            <form onSubmit={handleSubmitUpdate}>
                                <label>Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    onChange={handleOnChange} 
                                    value={task.name}/>

                                <label>Description</label>
                                <textarea 
                                    id="description" 
                                    onChange={handleOnChange} 
                                    value={task.description} />
                        
                                <label>Notes</label>
                                <textarea 
                                    id="notes" 
                                    onChange={handleOnChange} 
                                    value={task.notes} />


                                <label>Labels</label>
                                <div className="task-labels">
                                    {
                                        task.labels.map((label, index) => <TaskLabelDeletable 
                                            key={index}
                                            label={label} 
                                            handleDeleteLabel={handleDeleteLabel} />)
                                    }
                                </div>
                                <div className="labels-controls">
                                    <input 
                                        type="text" 
                                        placeholder="Label name..." 
                                        value={label} 
                                        onChange={e => setLabel(e.target.value)}/>
                                    <button 
                                        className="primary" 
                                        onClick={handleAddLabel}>Add label</button>
                                </div>
                                <div className="controls">
                                    <button 
                                        className="secondary" 
                                        onClick={handleOnClose}>Close</button>
                                    <button className="primary" type="submit">Update task</button>

                                </div>
                            </form>
                        </>
                        :
                        <>
                            <div className="controls">
                                <h2>{task.name}</h2>
                                <button onClick={() => setUpdateOn(state => !state)}>
                                    <EditOutlinedIcon /></button>
                            </div>
                            <div className="task-labels">
                                {
                                    task.labels.map((label, index) => <TaskLabelSimple 
                                        key={index} 
                                        label={label}/>)
                                }
                            </div>

                            <label>Description</label>
                            <div>{task.description}</div>
                            <label>Notes</label>
                            <div>{task.notes}</div>
                            
                        </>
                }
            </section>
            {
                message.isError && 
                <SnackbarWrapper open={open} setOpen={setOpen} message={message.text} />
            }
        </>
    );
};

export default Task;
