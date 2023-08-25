export const dbCollectionNames = {
    projectPath: (projectId) => ["projects", projectId], 
    projectsPath: "projects", 
    getCategoriesPath: (projectId) => ["projects", projectId, "categories"], 
    taskPath: (projectId, categoryId, taskId) => ["projects", projectId, 
        "categories", categoryId, "tasks", taskId], 
    tasksPath: (projectId, categoryId) => ["projects", projectId, 
        "categories", categoryId, "tasks"], 
    categoriesPath: (projectId) => ["projects", projectId, "categories"], 
    updateProjectPath: (projectId) => ["projects", projectId],
    categoryPath: (projectId, categoryId) => ["projects", projectId, "categories", categoryId],
};

export const defaultCategories = ["todo", "in progress", "blocked", "pr", "testing", "done"];