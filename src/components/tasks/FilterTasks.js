"use client";
import React, { useState } from "react";
import { useTaskFilterContext } from "../context/TaskFilterProvider";
import { useDebouncedCallback } from "use-debounce";
import { TaskLabelDeletable } from "./TaskLabels";


/**
 * Tasks filtering component
 * Contains a search bar to search by task title, 
 * and a search bar where the user can input label
 * names
 * The labels can also be selected from the task 
 * cards and these will also have the delete icon
 * on them, so they are easier to manage 
 * @returns 
 */
const FilterTasks = () => {
    const {query, setSearchString} = useTaskFilterContext();
    
    const [filtersOn, setFiltersOn] = useState(query.labels?.length > 0 ? true : false);
    const handleDeleteLabel = (labelName) => () => {
        setSearchString({labels: query.labels.filter(label => label !== labelName)});
    };

    const debouncedQuery = useDebouncedCallback((e) => {
        setSearchString({
            "query": e.target.value
        });
    }, 1000);

    const debouncedLabel = useDebouncedCallback((e) => {
        setSearchString({
            "labels": [...query.labels, e.target.value]
        });
    }, 1000);

    const handleSetFilters = () => setFiltersOn(state => !state);

    return (
        <>
            {filtersOn ? 
                <>
                    <span 
                        className="advanced-filters-toggle" 
                        onClick={handleSetFilters}>Hide filters</span>
                    <form className="task-filter">
                        <label>Filter by task title</label>
                        <input 
                            type="text"
                            id="query"
                            placeholder="Task title..."
                            defaultValue={query.query}
                            onChange={debouncedQuery}
                        />

                        <label>Filter by label name</label>
                        <div className="task-labels">
                            {
                                query.labels?.map((label, index) => <TaskLabelDeletable 
                                    key={index}
                                    label={label}
                                    handleDeleteLabel={handleDeleteLabel}
                                />
                                )
                            }
                        </div>
                        <input 
                            type="text"
                            id="labels"
                            placeholder="Label name..."
                            defaultValue={""}
                            onChange={debouncedLabel}
                        />
                    </form>
                </>
                :
                <span 
                    className="advanced-filters-toggle" 
                    onClick={handleSetFilters}>Advanced filters...</span>
            }
        </>
        
    );
};

export default FilterTasks;
