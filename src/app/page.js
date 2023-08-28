import React from "react";
import PageHeader from "@/components/PageHeader";
import Projects from "@/components/projects/Projects";
import AddProject from "@/components/projects/AddProject";

export default function Home() {
    return (
        <section>
            <PageHeader title="Projects"/>
            <AddProject />
            <Projects />
        </section>
    );
}
