"use client";

import { routes } from "@/utils/generalConstants";
import Link from "next/link";
import React from "react";
import { useSelectedProjectContext } from "./context/SelectedProjectProvider";

const Navbar = () => {
    const {selectedProject} = useSelectedProjectContext();
    return (
        <nav>
            <Link href={routes.mainPage}>Home</Link>
            {
                selectedProject
                && 
                <Link href={routes.projectRoute(selectedProject.id)}>{selectedProject.name}</Link>
            }
        </nav>
    );
};

export default Navbar;
