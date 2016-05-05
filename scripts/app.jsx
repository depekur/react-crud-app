'use strict';

var TodoApp = React.createClass({

  getInitialState: function() {
    return {
      data: [],
      editor: {
        TaskTitle: "",
        TaskMessage: "",
        TaskId: "",
      },
      search: ""
    };
  },

  componentDidMount: function() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer, this.props.pollInterval);
  },

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
    if (this.state.editor.TaskId) {
      /*
       *   update
       */
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: { 
          edit: true, 
          id: this.state.editor.TaskId,
          TaskTitle: this.state.editor.TaskTitle,
          TaskMessage: this.state.editor.TaskMessage
        },
        success: function(data) {
          this.setState({
            data: data,
            editor: {
              TaskTitle: '',
              TaskMessage: '',
              TaskId: '',
            }
          });
        }.bind(this),
        error: function(xhr, status, err) {
          //this.setState({data: tasks});
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    } else {
      /*
       *   create
       */
      if (this.state.data == null) {
        var newTasks = task;
      } else {
        var tasks = this.state.data;
        var newTasks = tasks.concat([task]);
      }

      this.setState({data: newTasks});

      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: task,
        success: function(data) {
          this.setState({
            data: data,
            editor: {
              TaskTitle: '',
              TaskMessage: '',
              TaskId: '',
            }
          });
        }.bind(this),
        error: function(xhr, status, err) {
          this.setState({data: tasks});
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });

    }
  },

  deleteTask: function(e) {
    e.preventDefault();
    //var taskIndex = parseInt(e.target.value, 10);
    var taskIndex = parseInt(this.state.editor.TaskId, 10);

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: { delete: true, id: taskIndex },
      success: function(data) {
        this.setState({
          data: data,
          editor: {
            TaskTitle: '',
            TaskMessage: '',
            TaskId: '',
          }
        });
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

    var task = $.extend({}, this.state.data.filter(function(x) {
      return x.TaskId == taskIndex;
    })[0] );

    this.setState({
      editor: {
        TaskTitle: task.TaskTitle,
        TaskMessage: task.TaskMessage,
        TaskId: taskIndex,
      }
    });
    console.log(this.state);

  },

  onEditorChange: function(title, message) {
    this.setState({
      editor: {
        TaskTitle: title,
        TaskMessage: message,
        TaskId: this.state.editor.TaskId,
      }
    });
  },

  handleDeleteClick: function(e) {
    e.preventDefault();
  },

  handleCancelClick: function(e) {
    e.preventDefault();
    this.setState({
      editor: {
        TaskTitle: '',
        TaskMessage: '',
        TaskId: ''
      }
    });
  },
  
  render: function() {
    return (
      <div className="wrapp">
        <h1 className="app-title">React CRUD app</h1>
        <section className="content">

          <TodoList 
            data={this.state.data} 
            editTask={this.editTask}
          />

          <TodoForm 
            onTaskSubmit={this.handleTaskSubmit} 
            onChange={this.onEditorChange}
            editor={this.state.editor} 
            handleDeleteClick={this.deleteTask}
            handleCancelClick={this.handleCancelClick}
          />

        </section>
      </div>
    );
  }
});

var TodoForm = React.createClass({

  handleSubmit: function(e, title, message) {
    e.preventDefault();
    var TaskTitle = this.refs.title.value.trim();
    var TaskMessage = this.refs.message.value.trim();
    if (!TaskTitle || !TaskMessage) {
      return;
    }
    this.props.onTaskSubmit({TaskTitle: TaskTitle, TaskMessage: TaskMessage});
    this.refs.title.value = '';
    this.refs.message.value = '';
  },

  onChange: function() {
    var title = this.refs.title.value;
    var message = this.refs.message.value;
    this.props.onChange(title, message);
  },
  
  render: function() {
    return (
    <form className="task-form" onSubmit={this.handleSubmit} >
      <input 
        ref="title"
        type="text" 
        placeholder="title" 
        value={this.props.editor.TaskTitle}      
        onChange={this.onChange}   
        autofocus
      />
      <textarea 
        ref="message"
        name="message" 
        placeholder="description" 
        value={this.props.editor.TaskMessage}  
        onChange={this.onChange}       
      ></textarea>
      <button type="submit">{this.props.editor.TaskId?"update":"create"}</button>  

      {this.props.editor.TaskId?<button onClick={this.props.handleDeleteClick}>delete</button>:null}
      {this.props.editor.TaskId?<button onClick={this.props.handleCancelClick}>cancel</button>:null}

    </form>
    );
  }
});

var TodoList = React.createClass({

  render: function() {

    if (this.props.data == null) {
      return <h2 className="error">nothing found</h2>;

    }
  /*
       else if(this.props.data.length === 1) {
          console.log(this.props.data.length);
          return (
            <ul className="tasksList">
              <Task 
                title={this.props.data[0].TaskTitle} 
                key={this.props.data[0].TaskId} 
                Taskid={this.props.data[0].TaskId} 
                text={this.props.data[0].TaskMessage} 
                time={this.props.data[0].TaskTime} 
                deleteTask={this.props.deleteTask}
                editTask={this.props.editTask}>
              </Task>
            </ul>
          ); 
      } 
  */
    var taskNodes = this.props.data.map(function(task) {
      return (
        <Task 
          title={task.TaskTitle} 
          key={task.TaskId} 
          Taskid={task.TaskId} 
          text={task.TaskMessage} 
          time={task.TaskTime} 
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
        
        </div>

      </li>
    );
  }
});



ReactDOM.render(<TodoApp url="/lab/react-crud-app/api/"  pollInterval={5000} />, document.getElementById('root'));