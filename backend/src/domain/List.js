class List {
  constructor(id, title, todos = []) {
    this.id = id
    this.title = title
    this.todos = todos
  }

  static fromDB(list) {
    return new List(list.id, list.title, list.todos)
  }
}

export default List