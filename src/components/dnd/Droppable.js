import { useDroppable } from "@dnd-kit/core";
import React from "react";

const Droppable = ({id, children}) => {
    const {isOver, setNodeRef} = useDroppable({id});
    return (
        <div ref={setNodeRef}>
            {children}
        </div>
    );
};

export default Droppable;
