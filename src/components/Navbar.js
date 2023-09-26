"use client";

import { routes } from "@/utils/generalConstants";
import Link from "next/link";
import React from "react";
import { useSelectedProjectContext } from "./context/SelectedProjectProvider";

const Navbar = () => {
    const {selectedProject} = useSelectedProjectContext();
    return (
        <nav>
            <span>
                <Link href={routes.mainPage}>Home</Link>
                {
                    selectedProject
                && 
                <Link href={routes.projectRoute(selectedProject.id)}>{selectedProject.name}</Link>
                }
            </span>
            <Link href={routes.apiPage}>API Reference</Link>
        </nav>
    );
};

export default Navbar;
