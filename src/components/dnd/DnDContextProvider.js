"use client";

import { DndContext } from "@dnd-kit/core";
import React from "react";

const DnDContextProvider = ({children}) => {

    const handleOnDragStart = (e) => {
        e.preventDefault();
    };

    return (
        <DndContext >
            {children}
        </DndContext>
    );
};

export default DnDContextProvider;
