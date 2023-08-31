import React from "react";
import PageHeader from "@/components/PageHeader";
import Projects from "@/components/projects/Projects";
import AddProject from "@/components/projects/AddProject";

export const metadata = {
    title: "Your projects - Personal Issue Tracker",
    description: "Free Kanban style issue tracking board",
};

export default function Home() {
    return (
        <section>
            <PageHeader title="Projects"/>
            <AddProject />
            <Projects />
        </section>
    );
}
