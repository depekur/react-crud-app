'use strict';

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

module.exports = TodoList;