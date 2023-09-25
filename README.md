- [Personal Issue Tracker](#personal-issue-tracker)
  - [Description](#description)
  - [Motivation](#motivation)
- [Technologies](#technologies)
- [Data format](#data-format)
- [Features](#features)
  - [To do](#to-do)

# Personal Issue Tracker

## Description

This is a Kanban-style issue tracking board, created with [Next.js 13](https://nextjs.org/), [Redux Toolkit](https://redux-toolkit.js.org/) and [Firebase Firestore](https://firebase.google.com/docs/firestore/). 

## Motivation

I have created this application in order to learn and practice the new features of Next.js 13. This application will also help me better organize future projects. 

# Technologies

Some of the main technologies and libraries used are: 

- [Next.js 13](https://nextjs.org/) - to set up the application's frontend and backend
- [Redux Toolkit](https://redux-toolkit.js.org/) - to manage the application's state
- [Firebase Firestore](https://firebase.google.com/docs/firestore/) - for data storage
- [dnd kit](https://dndkit.com/) - to add the ability to drag and drop the cards in the board
- [use-debounce](https://www.npmjs.com/package/use-debounce) - to debounce user input in the task filtering feature
- [SASS](https://sass-lang.com/) - for styling

# Data format

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

# Features

The user can add projects and 6 main categories are automatically added: todo, in progress, blocked, pr, testing and done. The project can be updated or deleted later. In case of deletion, all categories and tasks are automatically deleted. 

The same operations are available for the categories and tasks. Similarly, when deleting a category, the tasks are also deleted. 

The user can also apply filters on the task, by label, and search by task title. 

## To do

Other features I am planning to add:

- a rich text editor for the task description and notes
- pop-ups for the "Add task" and the task page, using the [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes) and [Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes) features
- the ability to customize the task page by adding new fields, without restrictions

