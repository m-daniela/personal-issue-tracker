import React from "react";
import PageHeader from "@/components/PageHeader";
import Projects from "@/components/projects/Projects";

export default function Home() {
    return (
        <section>
            <PageHeader title="Projects"/>
            <Projects />
        </section>
    );
}
