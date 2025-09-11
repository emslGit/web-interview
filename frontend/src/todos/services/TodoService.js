class TodoService {
  static async createTodo(todo) {
    const res = await fetch(`http://localhost:3001/lists/${todo.listId}/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
    if (!res.ok) {
      throw new Error('Error creating todo')
    }
    return res.json()
  }

  static async updateTodo(todo) {
    const res = await fetch(`http://localhost:3001/lists/${todo.listId}/todo/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
    if (!res.ok) {
      throw new Error('Error updating todo')
    }
    return res.json()
  }

  static async deleteTodo(todo) {
    const res = await fetch(`http://localhost:3001/lists/${todo.listId}/todo/${todo.id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      throw new Error('Error deleting todo')
    }
  }
}

export default TodoService