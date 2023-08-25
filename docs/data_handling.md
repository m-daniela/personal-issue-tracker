# Data handling

- [Data handling](#data-handling)
  - [Data format](#data-format)
- [Possible queries](#possible-queries)
  - [Projects](#projects)
    - [getProjects](#getprojects)


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

# Possible queries

## Projects

### getProjects

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