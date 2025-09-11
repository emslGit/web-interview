class Todo {
  constructor(id, text, status, listId, dueDate = null) {
    this.id = id
    this.text = text
    this.status = status
    this.listId = listId
    this.dueDate = dueDate
  }

  static fromDB(todo) {
    return new Todo(
      todo.id,
      todo.text,
      todo.status,
      todo.list_id,
      todo.due_date
    )
  }
}

export default Todo