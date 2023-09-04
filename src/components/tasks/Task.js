"use client";

import { 
    categoryIdsSelector, 
    moveTaskToCategory, 
    updateTask } from "@/redux/features/categoriesSlice";
import { apiUrls, routes } from "@/utils/generalConstants";
import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PageHeader from "../PageHeader";
import { useRouter } from "next/navigation";
import SnackbarWrapper from "../SnackbarWrapper";


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
    const categoryIds = useSelector(categoryIdsSelector);
    const dispatch = useDispatch();
    const [updateOn, setUpdateOn] = useState(false);
    const [task, setTask] = useState(taskData);
    const [category, setCategory] = useState("");
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState({
        text: "", 
        isError: false
    });
    const router = useRouter();

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

    const handleOnChangeCategory = (e) => {
        e.preventDefault();
        setCategory(e.target.value);
    };

    const handleMoveToCategory = async (e) => {
        e.preventDefault();
        const response = await fetch(
            apiUrls.updateTask(projectId, categoryId, taskData.id), 
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    categoryIdTo: categoryIds[category].id
                })
            });
        const updatedtask = await response.json();
        console.log(updateTask);
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
            dispatch(moveTaskToCategory({
                categoryIdFrom: categoryId, 
                categoryIdTo: categoryIds[category].id, 
                taskId: taskData.id
            }));
            router.push(routes.projectRoute(projectId));
        }

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
                            
                                {/* <span className={
                                    message.isError ? "message-error" : "message-success"}>
                                    {message.text}
                                </span> */}
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
                            <label>Description</label>
                            <div>{task.description}</div>
                            <label>Notes</label>
                            <div>{task.notes}</div>
                            <div>
                                <select onChange={handleOnChangeCategory} value={category}>
                                    {Object.keys(categoryIds).map(categoryName => <option 
                                        key={categoryName} 
                                        value={categoryName}>{categoryName}</option>)}
                                </select>
                                <button 
                                    className="primary" 
                                    onClick={handleMoveToCategory}>Move to category</button>
                            </div>

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
