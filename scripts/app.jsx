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
      searchQuery: "",
      message: ""
    };
  },

  componentDidMount: function() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer, this.props.pollInterval);
    
  },

  loadDataFromServer: function(query) {
    if (this.state.searchQuery && (query !== false) ) {
      return null;

    } else if (query == false || !query) {
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
    } 
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

          this.setMessage(this.props.updateMessage);

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

          this.setMessage(this.props.addMessage);

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

        this.setMessage(this.props.deleteMessage);

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });

  },

  editTask: function(e) {
    e.preventDefault();
    var taskIndex = parseInt(e.target.value, 10);

    var task = this.state.data.filter(function(x) {
      return x.TaskId == taskIndex;
    });

    this.setState({
      editor: {
        TaskTitle: task[0].TaskTitle,
        TaskMessage: task[0].TaskMessage,
        TaskId: taskIndex,
      }
    });
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

  onSearch: function(query) {

    if ( this.state.data !== null ) {
      var filteredData = this.state.data.filter(function(el) {
        var searchValue = el.TaskTitle.toLowerCase();
        return searchValue.indexOf(query) !== -1;
      }.bind(this));

      this.setState({
        data: filteredData,
        searchQuery: query
      });

      if ( query == '') {
        this.loadDataFromServer(false);
      }
    }
  },

  onClearSearch: function() {
    this.loadDataFromServer(false);
    this.setState({
      searchQuery: ''
    });
  },

  setMessage: function(message) {
    this.setState({
      message: message
    });

    setTimeout(function(){
      this.setState({
        message: ''
      });
    }.bind(this), this.props.messageTimeout );
  },
  
  render: function() {
    return (
      <div className="wrapp">
        <h1 className="app-title">React CRUD app</h1>
        <section className="content">

          <div>
            <SearchForm 
              onSearch={this.onSearch}
              searchQuery={this.state.searchQuery}
              onClearSearch={this.onClearSearch}
            />

            <TodoList 
              data={this.state.data} 
              editTask={this.editTask}
            />
          </div>

          <TodoForm 
            onTaskSubmit={this.handleTaskSubmit} 
            onChange={this.onEditorChange}
            editor={this.state.editor} 
            handleDeleteClick={this.deleteTask}
            handleCancelClick={this.handleCancelClick}
            message={this.state.message}
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

      {this.props.message?<div className="message">{this.props.message}</div>:null}

    </form>
    );
  }
});

var TodoList = React.createClass({

  render: function() {

    if (this.props.data == null) {
      return <h2 className="error">nothing found</h2>;
    }

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

var SearchForm = React.createClass({

  onSearch: function() {
    var query = this.refs.search.value.toLowerCase();
    this.props.onSearch(query);
    var button = true;
  },

  onClearSearch: function() {
    this.refs.search.value = '';
    this.props.onClearSearch();
  },

  render: function() {
    return (
      <div className="searchForm">
        Search: &nbsp;
        <input 
          ref="search"
          type="text" 
          onChange={this.onSearch}
        />
        {this.props.searchQuery?<button onClick={this.onClearSearch} >x</button>:null}
      </div>
    );
  }
});



ReactDOM.render(<TodoApp 
  url="/lab/react-crud-app/api/"  
  pollInterval={5000} 
  messageTimeout={3000}
  addMessage="сообщение успешно добавлено"
  deleteMessage="сообщение успешно удалено"
  updateMessage="сообщение успешно обновлено"
/>, document.getElementById('root'));