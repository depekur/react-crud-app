'use strict';

var TodoApp = React.createClass({

  loadDataFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err, data) {
        console.error(this.props.url, status, err.toString(), data);
      }.bind(this)
    });
  },
  handleTaskSubmit: function(task) {
    var tasks = this.state.data;

    var newTasks = tasks.concat([task]);
    this.setState({data: newTasks});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: task,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: tasks});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  deleteTask: function(e) {
    e.preventDefault();
    var taskIndex = parseInt(e.target.value, 10);

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: { delete: true, id: taskIndex },
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        //this.setState({data: tasks});
        console.error(status, err.toString());
      }.bind(this)
    });

  },
/*
нужно хранить в стейт еще и редактируемый элемент
передвать его в форму
в список передавать только список
 */
  editTask: function(e) {
    e.preventDefault();
    var taskIndex = parseInt(e.target.value, 10);
    console.log('azaza');

    var book = $.extend({}, this.state.books.filter(function(x) {
      return x.id == id;
    })[0] );

  },

  getInitialState: function() {
    return {
      data: [],
      inEditor: {
        TaskTitle: "",
        TaskMessage: "",
      },
      search: ""
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="wrapp">
        <h1 className="app-title">React CRUD app</h1>
        <section className="content">
          <TodoList data={this.state.data} deleteTask={this.deleteTask} editTask={this.editTask}/>
          <TodoForm onTaskSubmit={this.handleTaskSubmit} inEditor={this.state.inEditor} />
        </section>
      </div>
    );
  }
});

var TodoList = React.createClass({

  render: function() {
    var taskNodes = this.props.data.map(function(task) {
      return (
        <Task 
          title={task.TaskTitle} 
          key={task.TaskId} 
          Taskid={task.TaskId} 
          text={task.TaskMessage} 
          time={task.TaskTime} 
          deleteTask={this.props.deleteTask}
          editTask={this.props.editTask}>
        </Task>
      );
    }.bind(this));
    return (
      <ul className="tasksList">
        {taskNodes}
      </ul>
    );
  }
});

var Task = React.createClass({

  render: function() {
    return (
      <li className="task" >
        <h4 className="task-title">{this.props.title}</h4>
        <p className="task-data" >{this.props.text}</p>    

        <div className="taskButtons">
          <button 
            className="editTask" 
            onClick={this.props.editTask} 
            value={this.props.Taskid} 
          >edit</button>
          <button 
            className="deleteTask" 
            onClick={this.props.deleteTask} 
            value={this.props.Taskid} 
          >delete</button>          
        </div>

      </li>
    );
  }
});

var TodoForm = React.createClass({

  getInitialState: function() {
    return {TaskTitle: '', TaskMessage: ''};
  },

  handleTaskTitleChange: function(e) {
    this.setState({TaskTitle: e.target.value});
  },

  handleTaskMessageChange: function(e) {
    this.setState({TaskMessage: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var TaskTitle = this.state.TaskTitle.trim();
    var TaskMessage = this.state.TaskMessage.trim();
    if (!TaskTitle || !TaskMessage) {
      return;
    }
    this.props.onTaskSubmit({TaskTitle: TaskTitle, TaskMessage: TaskMessage});
    this.setState({TaskTitle: '', TaskMessage: ''});
  },

  render: function() {
    return (
    <form className="task-form" onSubmit={this.handleSubmit} >
      <input 
        type="text" 
        placeholder="title" 
        value={this.state.TaskTitle}
        onChange={this.handleTaskTitleChange}
         
        autofocus
      />
      <textarea 
        name="message" 
        placeholder="description" 
        value={this.state.TaskMessage}
        onChange={this.handleTaskMessageChange}
         
      ></textarea>
      <button type="submit">create</button>                  
    </form>
    );
  }
});

ReactDOM.render(<TodoApp url="/lab/react-crud-app/api/"  pollInterval={5000} />, document.getElementById('root'));