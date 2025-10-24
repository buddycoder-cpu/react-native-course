import {
    config,
    databases,
    ID
} from "./appwrite";

// fetch todos
export const fetchTodos = async () => {
    try {
        const response = await databases.listDocuments(
            config.db,
            config.col.todos
        )
        return response
    } catch (error) {
        throw (error)

    }
}

export const addTodo = async (todoInput) => {
    try {
        const newTodo = await databases.createDocument(
            config.db,
            config.col.todos,
            ID.unique(), {
                title: todoInput,
                completed: false
            }
        )
        return newTodo;
    } catch (error) {
        throw (error)
    }
}

export const removeTodo = async (id) => {
    try {
        await databases.deleteDocument(
            config.db,
            config.col.todos,
            id
        )
    } catch (error) {
        throw (error)
    }
}

export const toggleTodo = async (id, completed) => {
    try {
        const updatedTodo = databases.updateDocument(
            config.db,
            config.col.todos,
            id, {
                completed: !completed
            }
        )
        return updatedTodo;
    } catch (error) {
        throw (error)
    }
}

export const getTodoById = async (id) => {
    const response = await databases.getDocument(config.db, config.col.todos, id);
    return response;
};

export const updateTodo = async (id, data) => {
    const updatedTodo = databases.updateDocument(
        config.db,
        config.col.todos,
        id, 
        data
    )
    return updatedTodo;
};