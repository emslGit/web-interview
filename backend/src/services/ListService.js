import List from '../domain/list.js'
import Todo from '../domain/Todo.js'
import { db } from '../database/db.js'

class ListsService {
  constructor() { }

  static getAllLists() {
    const listsInDB = db.prepare('SELECT * FROM lists').all()
    const todosInDB = db.prepare('SELECT * FROM todos').all()

    const lists = {};
    for (const list of listsInDB) {
      lists[list.id] = List.fromDB(list)
    }
    for (const todo of todosInDB) {
      lists[todo.list_id].todos.push(Todo.fromDB(todo))
    }

    return lists
  }

  static getListById(id, todos = false) {
    const listInDB = db.prepare('SELECT * FROM lists WHERE id = ?').get(id)

    if (!listInDB) {
      throw new Error('List not found')
    }

    const list = List.fromDB(listInDB)

    if (todos) {
      const todosInDB = db.prepare('SELECT * FROM todos WHERE list_id = ?').all(id)
      list.todos = todosInDB.map(todo => Todo.fromDB(todo))
    }

    return list
  }
}

export default ListsService