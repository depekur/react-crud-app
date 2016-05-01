'use strict';

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

module.exports = TodoForm;