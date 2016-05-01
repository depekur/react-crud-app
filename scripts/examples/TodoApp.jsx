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
      url: '/lab/react-crud-app/api/',
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

  editTask: function(e) {
    e.preventDefault();
    var taskIndex = parseInt(e.target.value, 10);
    console.log(taskIndex);

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
      	<TodoList data={this.state.data} deleteTask={this.deleteTask} editTask={this.editTask}/>
      </section>
    );
  }
});


module.exports = TodoApp;