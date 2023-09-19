"use client";

import { routes } from "@/utils/generalConstants";
import Link from "next/link";
import React, { useContext } from "react";
import { SelectedProjectContext } from "./context/SelectedProjectProvider";

const Navbar = () => {
    const {selectedProject} = useContext(SelectedProjectContext);
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
