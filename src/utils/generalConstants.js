
const mainUrlApi = process.env.NEXT_PUBLIC_API_URL;

export const apiUrls = {
    getProjects: `${mainUrlApi}projects`,
    createProject: `${mainUrlApi}projects`,
    updateProject: (projectId) => `${mainUrlApi}projects/${projectId}`,
    deleteProject: (projectId) => `${mainUrlApi}projects/${projectId}`,
    getCategoriesAndTasks: (projectId) => `${mainUrlApi}projects/${projectId}/tasks`,
    getTask: (projectId, categoryId, taskId) => `${mainUrlApi}projects/${projectId}` +
    `/category/${categoryId}/task/${taskId}`,
    addTask: (projectId, categoryId) => `${mainUrlApi}projects/${projectId}` + 
    `/category/${categoryId}/task`,
    updateTask: (projectId, categoryId, taskId) => `${mainUrlApi}projects/${projectId}` +
    `/category/${categoryId}/task/${taskId}`,
    deleteTask: (projectId, categoryId, taskId) => `${mainUrlApi}projects/${projectId}` + 
    `/category/${categoryId}/task/${taskId}`,

};

export const routes = {
    mainPage: "/",
    projectsRoute: "/projects",
    projectRoute: (projectId) => `/projects/${projectId}`,
    taskRoute: (projectId, categoryId, taskId) => `/projects/${projectId}` +
    `/category/${categoryId}/task/${taskId}`,
    addTaskRoute: (projectId, categoryId) => `/projects/${projectId}/category/${categoryId}/task`,
};

export const draggableStyle = {
    backgroundColor: "#7600ad", 
    opacity: ".3"
};