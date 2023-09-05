"use client";

import Navbar from "@/components/Navbar";
import DisplayError from "@/components/utils/DisplayError";
import React from "react";
import { Inter } from "next/font/google";
import "../../styles/global.scss";

const inter = Inter({ subsets: ["latin"] });

const GlobalError = ({error, reset}) => {
    return (
        <html lang="en">
            <body className={inter.className}>

                <Navbar />
                <main>
                    <DisplayError error={error} reset={reset} />
                </main>

            </body>
        </html>
    );
};

export default GlobalError;
