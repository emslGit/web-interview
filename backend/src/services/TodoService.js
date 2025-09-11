import Todo from '../domain/Todo.js'
import { db } from '../database/db.js'

class TodoService {
  constructor() { }

  static getTodos() {
    const todosInDB = db.prepare('SELECT * FROM todos').all()
    return todosInDB.map(todo => Todo.fromDB(todo))
  }

  static getTodoById(id) {
    const todoInDB = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
    if (!todoInDB) {
      throw new Error('Todo not found')
    }
    return Todo.fromDB(todoInDB)
  }

  static getTodosByListId(listId) {
    const todosInDB = db.prepare('SELECT * FROM todos WHERE list_id = ?').all(listId)
    return todosInDB.map(todo => Todo.fromDB(todo))
  }

  static createTodo({ text, listId }) {
    const listInDB = db.prepare('SELECT * FROM lists WHERE id = ?').get(listId)

    if (!listInDB) {
      throw new Error('List not found')
    }
    const todoInDB = db.prepare('INSERT INTO todos (text, list_id) VALUES (?, ?) RETURNING *').get(text, listId)
    return Todo.fromDB(todoInDB)
  }

  static updateTodo({ id, text, status, dueDate }) {
    if (!this.getTodoById(id)) {
      throw new Error('Todo not found')
    }
    const statusValue = status ? 1 : 0
    const todoInDB = db.prepare('UPDATE todos SET text = ?, status = ?, due_date = ? WHERE id = ? RETURNING *').get(text, statusValue, dueDate, id)
    return Todo.fromDB(todoInDB)
  }

  static deleteTodo({ id }) {
    if (!this.getTodoById(id)) {
      throw new Error('Todo not found')
    }
    db.prepare('DELETE FROM todos WHERE id = ?').run(id)
  }

}

export default TodoService