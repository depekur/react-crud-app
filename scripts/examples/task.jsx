'use strict';

var Task = React.createClass({

  render: function() {
    return (
      <li className="task" >
	      <h4 className="task-title">{this.props.title}</h4>
	      <p className="task-data" >{this.props.text}</p>    

	      <div className="taskButtons">
          <button className="editTask" onClick={this.props.editTask} value={this.props.Taskid} >edit</button>
          <button className="deleteTask" onClick={this.props.deleteTask} value={this.props.Taskid} >delete</button>          
        </div>

   		</li>
    );
  }
});

module.exports = Task;