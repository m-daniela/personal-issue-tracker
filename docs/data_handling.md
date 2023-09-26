# Data handling

- [Data handling](#data-handling)
  - [Data format](#data-format)
- [Available queries](#available-queries)
  - [Fetch data](#fetch-data)
    - [getProjects](#getprojects)
    - [getCategoriesAndTasks](#getcategoriesandtasks)
    - [getTask](#gettask)
    - [Auxiliary functions](#auxiliary-functions)
  - [Add data](#add-data)
    - [addProject](#addproject)
    - [addTask](#addtask)
  - [Update data](#update-data)
    - [updateProject](#updateproject)
    - [updateTask](#updatetask)
    - [updateTaskCategory](#updatetaskcategory)
  - [Delete data](#delete-data)
    - [deleteProject](#deleteproject)
    - [deleteTask](#deletetask)


## Data format

The data is saved in a Firebase database and has the following format:

```
projects: collection
    id: string
        created_at: timestamp
        updated_at: timestamp
        name: string
        category_order: string[]
        categories: collection
            id: string
                created_at: timestamp
                updated_at: timestamp
                name: string
                tasks: string[]
                tasks: collection
                    id: string
                        created_at: timestamp
                        updated_at: timestamp
                        name: string
                        description: string
                        notes: string
                        labels: string[]
```

# Available queries

## Fetch data

### getProjects

`getProjects()`

This function fetches a list of the available projects. This contains only the project data and no information about the categories or tasks associated with these projects.

The data can be obtined from the `GET /api/projects` endpoint.

```json
[
    {
        "id": "p3M1oRZ07Os4yYrZ6nKD",
        "created_at": {
            "seconds": 1692788708,
            "nanoseconds": 231000000
        },
        "name": "first project",
        "updated_at": {
            "seconds": 1692788708,
            "nanoseconds": 232000000
        }
    },
    // ...
]
```

### getCategoriesAndTasks

`getCategoriesAndTasks(projectId)`

Fetches the categories and tasks for a given project id. It joins the results of two functions, `getCategories`, which returns the category data and an object with `categoryName - categoryId` pairs, and `getTasksByCategory`, which returns the tasks by category, ordered by creation date. 

Each category has an order number used for ordering.

The project id is also specified.

Endpoint: `GET projects/[projectId]/tasks`

```json
{
    "id": "p3M1oRZ07Os4yYrZ6nKD",
    "categoryIds": {
        "todo": {
            "id": "Nn4iKulkfb9Lg4Ysi7wD"
        },
        // ...
    },
    "categories": {
        "Nn4iKulkfb9Lg4Ysi7wD": {
            "id": "Nn4iKulkfb9Lg4Ysi7wD",
            "name": "todo",
            "order_no": 0,
            "tasks": [
                "MiuXkuiUSRudLSteIQ8n",
                "CuGImZu4gNwYPemlguYu"
            ]
        },
        // ...
    },
    "tasks": {
        "MiuXkuiUSRudLSteIQ8n": {
            "id": "MiuXkuiUSRudLSteIQ8n",
            "notes": "",
            "name": "test",
            "description": "test update",
            "updated_at": {
                "seconds": 1692789113,
                "nanoseconds": 840000000
            },
            "created_at": {
                "seconds": 1692788740,
                "nanoseconds": 575000000
            },
            "labels": []
        },
        // ...
    }
}
```


### getTask

`getTask(projectId, categoryId, taskId)`

Returns the task data.

Endpoint: `GET projects/[projectId]/category/[categoryId]/task/[taskId]`

```json
{
    "id": "MiuXkuiUSRudLSteIQ8n",
    "labels": [],
    "notes": "",
    "description": "abcd update",
    "name": "test",
    "created_at": {
        "seconds": 1692788740,
        "nanoseconds": 575000000
    },
    "updated_at": {
        "seconds": 1692789113,
        "nanoseconds": 840000000
    }
}
```

### Auxiliary functions

- `getCategories(projectId)` - returns the category data and an object with `categoryName - categoryId` pairs
- `getTasksByCategory(projectId, categories)` - returns the tasks by category, ordered by creation date
- `getCategoryIdsFromProject(projectId)` - returns a list of category ids based on project id
- `getTaskIdsFromCategory(projectId, categoryId)` - returns a list of task ids based on category id
- `projectExists(projectId)` - checks if the project exists
- `categoryExists(projectId, categoryId)` - checks if the category exists


## Add data

### addProject

`addProject(projectData)`

Add a new project. The timestamps are automatically set and the function returns the project data. 

Endpoint: `POST /projects`

```json
// request body
{
    "name": "Test Project"
}

// response body
{
    "id": "ijZU2oU73w4xQonkEMdZ",
    "name": "Test Project",
    "created_at": {
        "seconds": 1693040248,
        "nanoseconds": 713000000
    },
    "updated_at": {
        "seconds": 1693040248,
        "nanoseconds": 713000000
    }
}
```

The default categories are also added automatically. These are `["todo", "in progress", "blocked", "pr", "testing", "done"]`


### addTask

`addTask(projectId, categoryId, taskData)`

Add a new task. This function has two cases and only the request body differs:

1. when a new task is added - a new id is created
2. when a task is moved between categories - the task has an id and it is copied to the given category (more details in [Update data](#updatetaskcategory))

Endpoint - same for both cases: `POST projects/[projectId]/category/[categoryId]/task`

```json
// new task request body
{
    "name": "add task test",
    "description": "this is a test task", 
    "notes": "some notes", 
    "labels": ["label 1"]
}

// new task response body
{
    "id": "TJ5Kd3lH0wZqErTfe7SB",
    "name": "add task test",
    "description": "this is a test task",
    "notes": "some notes",
    "labels": [
        "label 1"
    ],
    "created_at": {
        "seconds": 1693041113,
        "nanoseconds": 826000000
    },
    "updated_at": {
        "seconds": 1693041113,
        "nanoseconds": 827000000
    }
}
```

## Update data

### updateProject

`updateProject(projectId, projectData)`

Update the project with the given data. 

Endpoint: `PUT projects/[projectId]`

```json
// request body
{
    "id": "ijZU2oU73w4xQonkEMdZ",
    "name": "Test Project Update",
    "created_at": {
        "seconds": 1693040248,
        "nanoseconds": 713000000
    },
    "updated_at": {
        "seconds": 1693040248,
        "nanoseconds": 713000000
    }
}

// response body
{
    "id": "ijZU2oU73w4xQonkEMdZ",
    "name": "Test Project Update",
    "created_at": {
        "seconds": 1693040248,
        "nanoseconds": 713000000
    },
    "updated_at": {
        "seconds": 1693055216,
        "nanoseconds": 118000000
    }
}
```


### updateTask

`updateTask(projectId, categoryId, taskId, taskData)`

Update the task with the given data. 

Endpoint: `PUT projects/[projectId]/category/[categoryId]/task`


```json
// request body
{
    "id": "pDcCfqSmhoE2SVe9ai7z",
    "name": "task update",
    "description": "this is a test task",
    "notes": "some notes",
    "labels": [
        "label 1"
    ],
    "created_at": {
        "seconds": 1693056186,
        "nanoseconds": 561000000
    },
    "updated_at": {
        "seconds": 1693056186,
        "nanoseconds": 561000000
    }
}


// response body
{
    "id": "pDcCfqSmhoE2SVe9ai7z",
    "name": "task update",
    "description": "this is a test task",
    "notes": "some notes",
    "labels": [
        "label 1"
    ],
    "created_at": {
        "seconds": 1693056186,
        "nanoseconds": 561000000
    },
    "updated_at": {
        "seconds": 1693056301,
        "nanoseconds": 563000000
    }
}
```


### updateTaskCategory

`updateTaskCategory(projectId, categoryIdFrom, categoryIdTo, taskId)`

Move the task between categories. This is the second case presented in the [Add data](#addtask) section.

If the task and destination category are found, the task will be added to the category and delete from the current category. 

This endpoint is the same as the one for [updateTask](#updatetask), but the request body is different. 

Endpoint: `PUT projects/[projectId]/category/[categoryId]/task/[taskId]`

```json
// request body
{
    "categoryIdTo": "4n3uAsNXHUOHOwJPdHit"
}

// response body
{
    "id": "pDcCfqSmhoE2SVe9ai7z",
    "updated_at": {
        "seconds": 1693059613,
        "nanoseconds": 297000000
    },
    "created_at": {
        "seconds": 1693056186,
        "nanoseconds": 561000000
    },
    "labels": [
        "label 1"
    ],
    "name": "task update",
    "description": "this is a test task",
    "notes": "some notes"
}
```

## Delete data

### deleteProject

`deleteProject(projectId)`

Delete the given project. This function will automatically delete all the tasks and categories associated with the project.

Returns the id of the deleted project. 

Endpoint: `DELETE /projects/[projectId]`

```json
{
    "id": "ijZU2oU73w4xQonkEMdZ"
}
```


### deleteTask

`deleteTask(projectId, categoryId, taskId)`

Delete the task from the given category and project. 

Returns the id of the deleted task.

Endpoint: `DELETE projects/[projectId]/category/[categoryId]/task/[taskId]`

```json
{
    "id": "pDcCfqSmhoE2SVe9ai7z"
}
```

