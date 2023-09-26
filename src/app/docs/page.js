import { getApiDocs } from "@/utils/getSwaggerDocs";
import ReactSwagger from "@/components/utils/ReactSwagger";
import React from "react";


export const metadata = {
    title: "API Reference - Personal Issue Tracker",
    description: "All available API endpoints with the request and response structure.",
};

const DocPage = async () => {
    const spec = await getApiDocs();
    return (
        <section className="container">
            <ReactSwagger spec={spec} />
        </section>
    );
};

export default DocPage;
