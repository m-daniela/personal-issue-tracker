"use client";

import { routes } from "@/utils/generalConstants";
import Link from "next/link";
import React from "react";

const Navbar = () => {
    return (
        <nav>
            <Link href={routes.mainPage}>Home</Link>
        </nav>
    );
};

export default Navbar;
