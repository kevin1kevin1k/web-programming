import React from 'react';
import ReactDOM from 'react-dom';

class TodoApp extends React.Component {
  render() {
    return (
        <section class="todoapp">
          <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus />
          </header>
          <section class="main">
            <input class="toggle-all" type="checkbox" />
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list"></ul>
          </section>
          <footer class="footer">
            <span class="todo-count"></span>
            <button class="clear-completed">Clear completed</button>
          </footer>
        </section>
      ); //<section>Hello</section>;
  }
}

ReactDOM.render(<TodoApp />, document.getElementById('root'));

