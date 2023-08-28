import Navbar from "@/components/Navbar";
import ProjectsPreloader from "@/components/preloaders/ProjectsPreloader";
import StoreProvider from "@/redux/StoreProvider";
import { setProjects } from "@/redux/features/projectsSlice";
import { store } from "@/redux/store";
import { apiUrls } from "@/utils/generalConstants";
import { Inter } from "next/font/google";
import "../../styles/global.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Personal Jira",
    description: "Jira, but better and free",
};

/**
 * Fetch and set the projects in the store.
 * This operation is done so they can be 
 * accessed in a preloader and used across
 * the project. The preloader is necessary 
 * so the projects are available in the 
 * client side as well, as setting the data
 * directly in the store state will make it
 * available only on the server side. 
 * @returns list of available projects
 */
const fetchProjects = async () => {
    const response = await fetch(apiUrls.getProjects);
    const projects = await response.json();
    store.dispatch(setProjects(projects));
    return projects; 
};

export default async function RootLayout({ children }) {
    const projects = await fetchProjects();

    return (
        <html lang="en">
            <body className={inter.className}>
                <ProjectsPreloader data={projects}/>
                <StoreProvider>
                    <Navbar />
                    <main>{children}</main>
                </StoreProvider>
            </body>
        </html>
    );
}
