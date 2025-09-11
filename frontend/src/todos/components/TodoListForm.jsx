import React, { useState } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import TodoService from '../services/TodoService'
import { DateField } from './DateField'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)

  const handleSaveTodo = async (todo, index) => {
    try {
      const isNew = !Boolean(todo.id)

      if (isNew && !todo.text.length) {
        return
      }

      let newTodos = todos;
      const todoData = { ...todo, status: Boolean(todo.status), listId: todoList.id }
      if (isNew) {
        const created = await TodoService.createTodo(todoData)
        newTodos = [
          ...todos.slice(0, index),
          created,
          ...todos.slice(index + 1)
        ];
      } else {
        const updated = await TodoService.updateTodo(todoData)
        newTodos = todos.map((_todo) => (_todo.id === updated.id ? updated : _todo));
      }

      setTodos(newTodos)
      saveTodoList(todoList.id, { todos: newTodos })
    } catch (error) {
      alert(error.message)
    }
  }

  const handleDeleteTodo = async (todo, index) => {
    try {
      const isNew = !Boolean(todo.id)

      if (!isNew) {
        await TodoService.deleteTodo({ ...todo, listId: todoList.id })
      }

      const newTodos = [
        ...todos.slice(0, index),
        ...todos.slice(index + 1)
      ];

      setTodos(newTodos)
      saveTodoList(todoList.id, { todos: newTodos })
    } catch (error) {
      console.error(error)
      alert('Error deleting todo')
    }
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          style={{ display: 'flex', marginTop: '1rem', flexDirection: 'column', flexGrow: 1, gap: '.5rem' }}
        >
          {todos.map((todo, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={todo.text ?? ''}
                onChange={(event) => {
                  setTodos([
                    // immutable update
                    ...todos.slice(0, index),
                    { ...todo, text: event.target.value },
                    ...todos.slice(index + 1),
                  ])
                }}
                onBlur={() => handleSaveTodo(todos[index], index)}
              />
              {todo.id && (
                <>
                  <div style={{ marginTop: '1rem' }}>
                    <DateField
                      todo={todo}
                      index={index}
                      onDateChange={(index, dueDate) => {
                        const updatedTodos = [
                          ...todos.slice(0, index),
                          { ...todos[index], dueDate },
                          ...todos.slice(index + 1),
                        ]
                        setTodos(updatedTodos)
                        handleSaveTodo(updatedTodos[index], index)
                      }}
                    />
                  </div>
                  <Checkbox
                    checked={Boolean(todo.status)}
                    onChange={(event) => handleSaveTodo({ ...todo, status: event.target.checked })}
                  />
                </>
              )}
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => handleDeleteTodo(todo, index)}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { text: '', status: false, dueDate: null }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
