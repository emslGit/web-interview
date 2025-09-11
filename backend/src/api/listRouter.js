import express from 'express'
import ListService from '../services/ListService.js'
import TodoService from '../services/TodoService.js'
import { ERROR_TYPES, HTTP_STATUS } from '../errors/ErrorTypes.js'

export const listRouter = express.Router()

listRouter.get('/', (req, res) => {
  try {
    const lists = ListService.getAllLists()
    res.status(HTTP_STATUS.OK).json(lists)
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_TYPES.INTERNAL_SERVER_ERROR,
      message: 'Failed to fetch lists'
    })
  }
})

listRouter.post('/:listId/todo', (req, res) => {
  try {
    const listId = req.params.listId
    const { text } = req.body

    if (!text || typeof text !== 'string') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: ERROR_TYPES.VALIDATION_ERROR,
        message: 'Text field is required and must be a string'
      })
    }
    if (!listId || typeof listId !== 'string') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: ERROR_TYPES.VALIDATION_ERROR,
        message: 'ListId parameter is required and must be a string'
      })
    }

    const todo = TodoService.createTodo({ text, listId })
    res.status(HTTP_STATUS.CREATED).location(`/api/lists/${listId}/todos/${todo.id}`).json(todo)
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_TYPES.INTERNAL_SERVER_ERROR,
      message: 'Failed to create todo'
    })
  }
})


listRouter.put('/:listId/todo/:todoId', (req, res) => {
  try {
    const todoId = req.params.todoId;
    const { text, status, dueDate } = req.body;

    if (!todoId || typeof todoId !== 'string') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: ERROR_TYPES.VALIDATION_ERROR,
        message: 'TodoId parameter is required and must be a string'
      })
    }
    if (!text || typeof text !== 'string') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: ERROR_TYPES.VALIDATION_ERROR,
        message: 'Text field is required and must be a string'
      })
    }
    if (status !== undefined && typeof status !== 'boolean') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: ERROR_TYPES.VALIDATION_ERROR,
        message: 'Status field must be a boolean'
      })
    }
    if (dueDate && (typeof dueDate !== 'string' || isNaN(new Date(dueDate).getTime()))) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: ERROR_TYPES.VALIDATION_ERROR,
        message: 'DueDate must be a valid date string'
      })
    }

    const updatedTodo = TodoService.updateTodo({ id: todoId, text, status, dueDate })
    res.status(HTTP_STATUS.OK).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_TYPES.INTERNAL_SERVER_ERROR,
      message: 'Failed to update todo'
    })
  }
})

listRouter.delete('/:listId/todo/:todoId', (req, res) => {
  try {
    const todoId = req.params.todoId;
    if (todoId === undefined || typeof todoId !== 'string') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: ERROR_TYPES.VALIDATION_ERROR,
        message: 'TodoId parameter is required and must be a string'
      })
    }

    TodoService.deleteTodo({ id: todoId })
    res.status(HTTP_STATUS.NO_CONTENT).end()
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: ERROR_TYPES.INTERNAL_SERVER_ERROR,
      message: 'Failed to delete todo'
    })
  }
})

