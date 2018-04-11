import React from 'react';
import ReactDOM from 'react-dom';

class TodoItem {
  constructor(name, index) {
    this.name = name;
    this.index = index;
    this.done = false;
  }
}

class TodoList {
  constructor(name, index) {
    this.name = name;
    this.index = index;
    this.todoItems = [];
    this.inputText = "";
  }
}

class TodoItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {del: false};
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleDeleteThis = this.handleDeleteThis.bind(this);
  }

  onMouseOver() {
    this.setState({del: !this.props.todoItem.done});
  }

  onMouseLeave() {
    this.setState({del: this.props.todoItem.done});
  }

  onClick() {
    this.props.handleToggleTodoItem(this.props.todoItem.index);
  }

  handleDeleteThis() {
    this.props.handleDeleteTodoItem(this.props.todoItem.index);
  }

  render() {
    const todoItem = this.props.todoItem;
    const done = todoItem.done ? "done" : "pending";
    var content = todoItem.name + ", " + done + ", " + todoItem.index;
    if (this.state.del) {
      content = <del>{content}</del>;
    }
    else {
      content = <span>{content}</span>;
    }

    return (
      <div>
        <span
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
        >
          {content}
        </span>
        <button
          type="button"
          class="close"
          aria-label="Close"
          onClick={this.handleDeleteThis}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

class TodoListCard extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleToggleTodoItem = this.handleToggleTodoItem.bind(this);
    this.handleDeleteThis = this.handleDeleteThis.bind(this);
    this.handleDeleteTodoItem = this.handleDeleteTodoItem.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.handleCreateTodoItem(this.props.todoList.index);
  }

  onChange(event) {
    this.props.handleCreateTodoItemTextChange(this.props.todoList.index, event.target.value);
  }

  handleEnter(event) {
    if (event.which == 13) {
      event.target.blur();
    }
  }

  handleToggleTodoItem(itemIndex) {
    this.props.handleToggleTodoItemOfTodoList(itemIndex, this.props.todoList.index);
  }

  handleDeleteThis() {
    this.props.handleDeleteTodoList(this.props.todoList.index);
  }

  handleDeleteTodoItem(itemIndex) {
    this.props.handleDeleteTodoItemOfTodoList(itemIndex, this.props.todoList.index);
  }

  render() {
    const todoList = this.props.todoList;
    var todoItemCards = todoList.todoItems.map(
      (todoItem) => <TodoItemCard todoItem={todoItem} handleToggleTodoItem={this.handleToggleTodoItem} handleDeleteTodoItem={this.handleDeleteTodoItem} />
    );

    return (
      <div>
        <span contentEditable="true" onKeyPress={this.handleEnter}>
          {todoList.name + ", " + todoList.index}
        </span>
        <button
          type="button"
          class="close"
          aria-label="Close"
          onClick={this.handleDeleteThis}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <form class="input-group" onSubmit={this.onSubmit}>
          <input
            type="text"
            class="form-control"
            value={this.props.todoList.inputText}
            placeholder="Enter the title of todo item..."
            onChange={this.onChange}
            autoFocus
          />
          <span class="input-group-btn">
            <button type="submit" class="btn btn-success">Create</button>
          </span>
        </form>
        {todoItemCards}
      </div>
    );
  }
}

class InputBox extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.handleCreateTodoList();
  }

  onChange(event) {
    this.props.handleCreateTodoListTextChange(event.target.value);
  }

  render() {
    return (
      <form class="input-group" onSubmit={this.onSubmit}>
        <input
          type="text"
          class="form-control"
          value={this.props.text}
          placeholder="Enter the title of todo list..."
          onChange={this.onChange}
          autoFocus
        />
        <span class="input-group-btn">
          <button type="submit" class="btn btn-success">Create</button>
        </span>
      </form>
    );
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      todoLists: [],
    };
    this.handleCreateTodoList = this.handleCreateTodoList.bind(this);
    this.handleCreateTodoListTextChange = this.handleCreateTodoListTextChange.bind(this);
    this.handleCreateTodoItem = this.handleCreateTodoItem.bind(this);
    this.handleCreateTodoItemTextChange = this.handleCreateTodoItemTextChange.bind(this);
    this.handleToggleTodoItemOfTodoList = this.handleToggleTodoItemOfTodoList.bind(this);
    this.handleDeleteTodoList = this.handleDeleteTodoList.bind(this);
    this.handleDeleteTodoItemOfTodoList = this.handleDeleteTodoItemOfTodoList.bind(this);
  }

  handleCreateTodoList() {
    var todoLists = this.state.todoLists;
    var newTodoLists = todoLists.concat(
      new TodoList(this.state.inputText, todoLists.length)
    );
    this.setState({
      inputText: "",
      todoLists: newTodoLists,
    });
  }

  handleCreateTodoListTextChange(changedText) {
    this.setState({
      inputText: changedText,
    });
  }

  handleCreateTodoItem(index) {
    var newTodoLists = this.state.todoLists;
    var newTodoList = newTodoLists[index];
    newTodoList.todoItems.push(
      new TodoItem(newTodoList.inputText, newTodoList.todoItems.length)
    );
    newTodoList.inputText = "";
    newTodoLists[index] = newTodoList;
    this.setState({
      todoLists: newTodoLists,
    });
  }

  handleCreateTodoItemTextChange(index, changedText) {
    var newTodoLists = this.state.todoLists;
    newTodoLists[index].inputText = changedText;
    this.setState({
      todoLists: newTodoLists,
    });
  }

  handleToggleTodoItemOfTodoList(itemIndex, listIndex) {
    var newTodoLists = this.state.todoLists;
    var newTodoList = newTodoLists[listIndex];
    var newTodoItem = newTodoList.todoItems[itemIndex];
    newTodoItem.done = !newTodoItem.done;
    newTodoList.todoItems[itemIndex] = newTodoItem;
    newTodoLists[listIndex] = newTodoList;
    this.setState({
      todoLists: newTodoLists,
    });
  }

  handleDeleteTodoList(index) {
    var newTodoLists = this.state.todoLists;
    newTodoLists.splice(index, 1);
    for (let i = 0; i < newTodoLists.length; i++) {
      newTodoLists[i].index = i;
    }
    this.setState({
      todoLists: newTodoLists,
    });
  }

  handleDeleteTodoItemOfTodoList(itemIndex, listIndex) {
    var newTodoLists = this.state.todoLists;
    var newTodoList = newTodoLists[listIndex];
    newTodoList.todoItems.splice(itemIndex, 1);
    for (let i = 0; i < newTodoList.todoItems.length; i++) {
      newTodoList.todoItems[i].index = i;
    }
    newTodoLists[listIndex] = newTodoList;
    this.setState({
      todoLists: newTodoLists,
    });
  }

  render() {
    var todoListCards = this.state.todoLists.map(
      (todoList) => (
        <TodoListCard
          todoList={todoList}
          handleCreateTodoItem={this.handleCreateTodoItem}
          handleCreateTodoItemTextChange={this.handleCreateTodoItemTextChange}
          handleToggleTodoItemOfTodoList={this.handleToggleTodoItemOfTodoList}
          handleDeleteTodoList={this.handleDeleteTodoList}
          handleDeleteTodoItemOfTodoList={this.handleDeleteTodoItemOfTodoList}
        />
      )
    );

    return (
        <div>
          <h1>Todo List</h1>
          <InputBox
            text={this.state.inputText}
            handleCreateTodoList={this.handleCreateTodoList}
            handleCreateTodoListTextChange={this.handleCreateTodoListTextChange}
          />
          {todoListCards}
        </div>
    );
  }
}

ReactDOM.render(<TodoApp />, document.getElementById('root'));

