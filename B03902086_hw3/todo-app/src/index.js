import React from 'react';
import ReactDOM from 'react-dom';

class TodoItem {
  constructor(name) {
    this.name = name;
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
  }
  
  onMouseOver() {
    this.setState({del: !this.props.todoItem.done});
  }
  
  onMouseLeave() {
    this.setState({del: this.props.todoItem.done});
  }
  
  render() {
    const todoItem = this.props.todoItem;
    const done = todoItem.done ? "done" : "pending";
    if (this.state.del) {
      return (
        <div>
          <span onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
            <del>
              Name: {todoItem.name}, {done}
            </del>
          </span>
        </div>
      );
    }
    else {
      return (
        <div>
          <span onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
            Name: {todoItem.name}, {done}
          </span>
        </div>
      );
    }
  }
}

class TodoListCard extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
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
  
  render() {
    const todoList = this.props.todoList;
    var todoItemCards = todoList.todoItems.map(
      (todoItem) => <TodoItemCard todoItem={todoItem}/>
    );
    
    return (
      <div>
        <p contentEditable="true" onKeyPress={this.handleEnter}>
          {todoList.name + ", " + todoList.index}
        </p>
        <form class="input-group" onSubmit={this.onSubmit}>
          <input type="text" class="form-control" value={this.props.todoList.inputText} placeholder="Enter the title of todo item..." onChange={this.onChange} autoFocus />
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
        <input type="text" class="form-control" value={this.props.text} placeholder="Enter the title of todo list..." onChange={this.onChange} autoFocus />
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
      new TodoItem(newTodoList.inputText)
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
  
  render() {
    var todoListCards = this.state.todoLists.map(
      (todoList) => (
        <TodoListCard todoList={todoList} handleCreateTodoItem={this.handleCreateTodoItem} handleCreateTodoItemTextChange={this.handleCreateTodoItemTextChange} />
      )
    );
    
    return (
        <div>
          <h1>
            Todo List
          </h1>
          <InputBox text={this.state.inputText} handleCreateTodoList={this.handleCreateTodoList} handleCreateTodoListTextChange={this.handleCreateTodoListTextChange} />
          {todoListCards}
        </div>
    );
  }
}

ReactDOM.render(<TodoApp />, document.getElementById('root'));

