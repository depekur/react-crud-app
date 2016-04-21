var TodoBox = React.createClass({

  loadDataFromServer: function() {
    $.ajax({
      url: this.props.url,
      //dataType: 'json',
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

    //task.id = Date.now();
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

  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer, this.props.pollInterval);
  },
  componentWillUnmount: function() {

  },
  render: function() {
    return (
      <section className="content">
        <h1>React CRUD app</h1>
      	<TodoForm onTaskSubmit={this.handleTaskSubmit} />
      	<TodoList data={this.state.data} />
      </section>
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
		    required 
		    autofocus
	    />
	    <textarea 
		    name="message" 
		    placeholder="description" 
        value={this.state.TaskMessage}
        onChange={this.handleTaskMessageChange}
		    required 
	    ></textarea>
	    <button type="submit">send</button>                  
    </form>
    );
  }
});

var TodoList = React.createClass({
  deleteTask: function(e) {
    //e.preventDefault();

  },

  editTask: function(e) {
    //e.preventDefault();

  },
  render: function() {
    var taskNodes = this.props.data.map(function(task) {
      return (
        <Task title={task.TaskTitle} key={task.TaskId} id={task.TaskId} text={task.TaskMessage} time={task.TaskTime} >

        </Task>
      );
    });
    return (
      <ul className="commentList">
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
	      <button type="submit" className="task-delete" onSubmit={this.props.deleteTask} >del</button>
        <button type="submit" className="task-edit" onSubmit={this.props.editTask} >edit</button>
   		</li>
    );
  }
});



ReactDOM.render(<TodoBox url="http://bananagarden.net/lab/react-crud-app/api/" pollInterval={5000} />, document.getElementById('content'));