"use client";

import React, { useContext, useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { useDispatch, useSelector } from "react-redux";
import { 
    categoriesProjectIdSelector, 
    categoriesSelector, 
    categoryIdsSelector,
    updateCategoryOrder, 
} from "@/redux/features/categoriesSlice";
import { SelectedProjectContext } from "../context/SelectedProjectProvider";
import { projectSelectorById } from "@/redux/features/projectsSlice";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";


/**
 * Display the list of categories
 */
const Categories = () => {
    const { handleSelectProject } = useContext(SelectedProjectContext);

    const dispatch = useDispatch();
    const categories = useSelector(categoriesSelector);
    const categoriesIds = useSelector(categoryIdsSelector);
    const projectId = useSelector(categoriesProjectIdSelector);
    const project = useSelector(projectSelectorById(projectId));

    console.log(categoriesIds, categories);

    const [activeCategory, setActiveCategory] = useState(null);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    });
    const sensors = useSensors(pointerSensor);

    // useEffect(() => {
    //     handleSelectProject(project);
    // }, [project]);

    const handleOnDragStart = (e) => {
        console.log("drag start", e);

        // save the dragging column
        if (e.active.data.current?.type === "Column" ){
            setActiveCategory(e.active.data.current.category);
            return;
        }
    };

    const handleOnDragEnd = (e) => {
        console.log("drag end", e);
        const {active, over} = e;
        if (!over) {
            return;
        }

        const activeColumnId = active.id.toString();
        const overColumnId = over.id.toString();

        if (activeColumnId === overColumnId){
            return;
        }

        const indexSource = categoriesIds.findIndex(categoryId => categoryId === activeColumnId);
        const indexDestination = categoriesIds.findIndex(categoryId => categoryId === overColumnId);
        // dnd kit function that places the column in the right place
        const categoryIds = arrayMove(categoriesIds, indexSource, indexDestination);
       
        dispatch(updateCategoryOrder(categoryIds));
    };

    return (
        <DndContext
            onDragStart={handleOnDragStart}
            onDragEnd={handleOnDragEnd}
            sensors={sensors}>
            <section className="categories">
                <SortableContext items={categoriesIds}>
                    {
                        categoriesIds.map(categoryId => <CategoryItem 
                            key={categoryId} 
                            category={categories[categoryId]} 
                            projectId={projectId} />)
                    }
                    {/* {
                        Object.values(categories)?.map(category => <CategoryItem 
                            key={category.id} 
                            category={category} 
                            projectId={projectId} />)
                    } */}
                    {createPortal(<DragOverlay>
                        {activeCategory && <CategoryItem 
                            category={activeCategory} 
                            projectId={projectId}/>
                        }
                    </DragOverlay>, document.body)}
                </SortableContext>
            </section>
        </DndContext>
    );
};

export default Categories;
