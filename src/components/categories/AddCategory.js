"use client";

import { apiUrls } from "@/utils/generalConstants";
import React, {useState} from "react";
import { useDispatch } from "react-redux";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SnackbarWrapper from "../SnackbarWrapper";
import { updateProject, useProjectSelectorById } from "@/redux/features/projectsSlice";
import { addCategory } from "@/redux/features/categoriesSlice";


/**
 * Add category
 */
const AddCategory = ({projectId}) => {
    const dispatch = useDispatch();
    const project = useProjectSelectorById(projectId);
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState({
        text: "", 
        isError: false
    });

    const handleSumbitCategory = async (e) => {
        e.preventDefault();
        const categoryName = e.target[0].value;
        const response = await fetch(
            apiUrls.createCategory(projectId), 
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({name: categoryName})
            });
        const categoryData = await response.json();

        if (categoryData.error){
            setMessage({
                text: `Error while adding the category: ${categoryData.error.message}`, 
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
            e.target[0].value = "";
            const updatedProject = {
                ...project, 
                category_order: [...project.category_order, categoryData.id]
            };

            dispatch(addCategory({categoryId: categoryData.id, categoryData}));
            dispatch(updateProject(updatedProject));
        }
    };

    return (
        <>
            <section className="add-element">
                <form onSubmit={handleSumbitCategory}>
                    <input type="text" placeholder="Category name..." />
                    <button type="submit"><AddOutlinedIcon /></button>
                </form>
            </section>
            {
                message.isError && 
                <SnackbarWrapper open={open} setOpen={setOpen} message={message.text} />
            }
        </>
    );
};

export default AddCategory;
