"use client";

import React from "react";
import Preloader from "./Preloader";
import { setCategories } from "@/redux/features/categoriesSlice";

const CategoriesPreloader = ({data}) => {
    return (
        <Preloader action={setCategories} data={data} />
    );
};

export default CategoriesPreloader;
