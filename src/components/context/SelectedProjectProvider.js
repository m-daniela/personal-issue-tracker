"use client";
 
import { SelectedProjectError } from "@/utils/errors/errors";
import { createContext, useContext, useState } from "react";
 
export const SelectedProjectContext = createContext(null);

export const useSelectedProjectContext = () => {
    const context = useContext(SelectedProjectContext);
    if (!context){
        throw new SelectedProjectError();
    }
    return context;
};
 
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
