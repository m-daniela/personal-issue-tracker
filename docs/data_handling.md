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


## Data format

The data is saved in a Firebase database and has the following format:

```
projects
    id
        created_at
        updated_at
        name
        categories
            id
                name
                order_no
                tasks
                    id
                        created_at
                        updated_at
                        name
                        description
                        notes
                        labels
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
2. when a task is moved between categories - the task has an id and it is copied to the given category (more details in Update data)

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