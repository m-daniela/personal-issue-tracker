import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "src/app/api",
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Personal Issue Tracker API Reference",
                description: "This page contains the available API endpoints " + 
                "of this application and the expected requests and responses " + 
                "for each operation.",
                version: "1.0",
            },
            components: { },
            security: [],
        },
    });
    return spec;
};