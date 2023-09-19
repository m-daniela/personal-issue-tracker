"use client";
 
import { createContext, useState } from "react";
 
export const SelectedProjectContext = createContext({});
 
const SelectedProjectProvider = ({children}) => {
    const [selectedProject, setSelectedProject] = useState(null);
    const handleSelectProject = (project) => {
        setSelectedProject(project);
    };
    return (
        <SelectedProjectContext.Provider value={{selectedProject, handleSelectProject}}>
            {children}
        </SelectedProjectContext.Provider>);
};

export default SelectedProjectProvider;
