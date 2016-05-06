/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var TodoApp = React.createClass({
	  displayName: "TodoApp",


	  getInitialState: function getInitialState() {
	    return {
	      data: [],
	      editor: {
	        TaskTitle: "",
	        TaskMessage: "",
	        TaskId: ""
	      },
	      searchQuery: "",
	      message: ""
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.loadDataFromServer();
	    setInterval(this.loadDataFromServer, this.props.pollInterval);
	  },

	  loadDataFromServer: function loadDataFromServer(query) {
	    if (this.state.searchQuery && query !== false) {
	      return null;
	    } else if (query == false || !query) {
	      $.ajax({
	        url: this.props.url,
	        dataType: 'json',
	        cache: false,
	        success: function (data) {
	          this.setState({ data: data });
	        }.bind(this),
	        error: function (xhr, status, err, data) {
	          console.error(this.props.url, status, err.toString(), data);
	        }.bind(this)
	      });
	    }
	  },

	  handleTaskSubmit: function handleTaskSubmit(task) {
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
	        success: function (data) {
	          this.setState({
	            data: data,
	            editor: {
	              TaskTitle: '',
	              TaskMessage: '',
	              TaskId: ''
	            }
	          });

	          this.setMessage(this.props.updateMessage);
	        }.bind(this),
	        error: function (xhr, status, err) {
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

	      this.setState({ data: newTasks });

	      $.ajax({
	        url: this.props.url,
	        dataType: 'json',
	        type: 'POST',
	        data: task,
	        success: function (data) {
	          this.setState({
	            data: data,
	            editor: {
	              TaskTitle: '',
	              TaskMessage: '',
	              TaskId: ''
	            }
	          });

	          this.setMessage(this.props.addMessage);
	        }.bind(this),
	        error: function (xhr, status, err) {
	          this.setState({ data: tasks });
	          console.error(this.props.url, status, err.toString());
	        }.bind(this)
	      });
	    }
	  },

	  deleteTask: function deleteTask(e) {
	    e.preventDefault();
	    var taskIndex = parseInt(this.state.editor.TaskId, 10);

	    $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      type: 'POST',
	      data: { delete: true, id: taskIndex },
	      success: function (data) {
	        this.setState({
	          data: data,
	          editor: {
	            TaskTitle: '',
	            TaskMessage: '',
	            TaskId: ''
	          }
	        });

	        this.setMessage(this.props.deleteMessage);
	      }.bind(this),
	      error: function (xhr, status, err) {
	        console.error(status, err.toString());
	      }.bind(this)
	    });
	  },

	  editTask: function editTask(e) {
	    e.preventDefault();
	    var taskIndex = parseInt(e.target.value, 10);

	    var task = this.state.data.filter(function (x) {
	      return x.TaskId == taskIndex;
	    });

	    this.setState({
	      editor: {
	        TaskTitle: task[0].TaskTitle,
	        TaskMessage: task[0].TaskMessage,
	        TaskId: taskIndex
	      }
	    });
	  },

	  onEditorChange: function onEditorChange(title, message) {
	    this.setState({
	      editor: {
	        TaskTitle: title,
	        TaskMessage: message,
	        TaskId: this.state.editor.TaskId
	      }
	    });
	  },

	  handleCancelClick: function handleCancelClick(e) {
	    e.preventDefault();
	    this.setState({
	      editor: {
	        TaskTitle: '',
	        TaskMessage: '',
	        TaskId: ''
	      }
	    });
	  },

	  onSearch: function onSearch(query) {

	    if (this.state.data !== null) {
	      var filteredData = this.state.data.filter(function (el) {
	        var searchValue = el.TaskTitle.toLowerCase();
	        return searchValue.indexOf(query) !== -1;
	      }.bind(this));

	      this.setState({
	        data: filteredData,
	        searchQuery: query
	      });

	      if (query == '') {
	        this.loadDataFromServer(false);
	      }
	    }
	  },

	  onClearSearch: function onClearSearch() {
	    this.loadDataFromServer(false);
	    this.setState({
	      searchQuery: ''
	    });
	  },

	  setMessage: function setMessage(message) {
	    this.setState({
	      message: message
	    });

	    setTimeout(function () {
	      this.setState({
	        message: ''
	      });
	    }.bind(this), this.props.messageTimeout);
	  },

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "wrapp" },
	      React.createElement(
	        "h1",
	        { className: "app-title" },
	        "React CRUD app"
	      ),
	      React.createElement(
	        "section",
	        { className: "content" },
	        React.createElement(
	          "div",
	          null,
	          React.createElement(SearchForm, {
	            onSearch: this.onSearch,
	            searchQuery: this.state.searchQuery,
	            onClearSearch: this.onClearSearch
	          }),
	          React.createElement(TodoList, {
	            data: this.state.data,
	            editTask: this.editTask
	          })
	        ),
	        React.createElement(TodoForm, {
	          onTaskSubmit: this.handleTaskSubmit,
	          onChange: this.onEditorChange,
	          editor: this.state.editor,
	          handleDeleteClick: this.deleteTask,
	          handleCancelClick: this.handleCancelClick,
	          message: this.state.message
	        })
	      )
	    );
	  }
	});

	var TodoForm = React.createClass({
	  displayName: "TodoForm",


	  handleSubmit: function handleSubmit(e, title, message) {
	    e.preventDefault();
	    var TaskTitle = this.refs.title.value.trim();
	    var TaskMessage = this.refs.message.value.trim();
	    if (!TaskTitle || !TaskMessage) {
	      return;
	    }
	    this.props.onTaskSubmit({ TaskTitle: TaskTitle, TaskMessage: TaskMessage });
	  },

	  onChange: function onChange() {
	    var title = this.refs.title.value;
	    var message = this.refs.message.value;
	    this.props.onChange(title, message);
	  },

	  render: function render() {
	    return React.createElement(
	      "form",
	      { className: "task-form", onSubmit: this.handleSubmit },
	      React.createElement("input", {
	        ref: "title",
	        type: "text",
	        placeholder: "title",
	        value: this.props.editor.TaskTitle,
	        onChange: this.onChange,
	        autofocus: true
	      }),
	      React.createElement("textarea", {
	        ref: "message",
	        name: "message",
	        placeholder: "description",
	        value: this.props.editor.TaskMessage,
	        onChange: this.onChange
	      }),
	      React.createElement(
	        "button",
	        { type: "submit" },
	        this.props.editor.TaskId ? "update" : "create"
	      ),
	      this.props.editor.TaskId ? React.createElement(
	        "button",
	        { onClick: this.props.handleDeleteClick },
	        "delete"
	      ) : null,
	      this.props.editor.TaskId ? React.createElement(
	        "button",
	        { onClick: this.props.handleCancelClick },
	        "cancel"
	      ) : null,
	      this.props.message ? React.createElement(
	        "div",
	        { className: "message" },
	        this.props.message
	      ) : null
	    );
	  }
	});

	var TodoList = React.createClass({
	  displayName: "TodoList",


	  render: function render() {

	    if (this.props.data == null) {
	      return React.createElement(
	        "h2",
	        { className: "error" },
	        "nothing found"
	      );
	    }

	    var taskNodes = this.props.data.map(function (task) {
	      return React.createElement(Task, {
	        title: task.TaskTitle,
	        key: task.TaskId,
	        Taskid: task.TaskId,
	        text: task.TaskMessage,
	        time: task.TaskTime,
	        editTask: this.props.editTask });
	    }.bind(this));
	    return React.createElement(
	      "ul",
	      { className: "tasksList" },
	      taskNodes
	    );
	  }
	});

	var Task = React.createClass({
	  displayName: "Task",


	  render: function render() {
	    return React.createElement(
	      "li",
	      { className: "task" },
	      React.createElement(
	        "h4",
	        { className: "task-title" },
	        this.props.title
	      ),
	      React.createElement(
	        "p",
	        { className: "task-data" },
	        this.props.text
	      ),
	      React.createElement(
	        "div",
	        { className: "taskButtons" },
	        React.createElement(
	          "button",
	          {
	            className: "editTask",
	            onClick: this.props.editTask,
	            value: this.props.Taskid
	          },
	          "edit"
	        )
	      )
	    );
	  }
	});

	var SearchForm = React.createClass({
	  displayName: "SearchForm",


	  onSearch: function onSearch() {
	    var query = this.refs.search.value.toLowerCase();
	    this.props.onSearch(query);
	    var button = true;
	  },

	  onClearSearch: function onClearSearch() {
	    this.refs.search.value = '';
	    this.props.onClearSearch();
	  },

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "searchForm" },
	      "Search:  ",
	      React.createElement("input", {
	        ref: "search",
	        type: "text",
	        onChange: this.onSearch
	      }),
	      this.props.searchQuery ? React.createElement(
	        "button",
	        { onClick: this.onClearSearch },
	        "x"
	      ) : null
	    );
	  }
	});

	ReactDOM.render(React.createElement(TodoApp, {
	  url: "/lab/react-crud-app/api/",
	  pollInterval: 5000,
	  messageTimeout: 3000,
	  addMessage: "сообщение успешно добавлено",
	  deleteMessage: "сообщение успешно удалено",
	  updateMessage: "сообщение успешно обновлено"
	}), document.getElementById('root'));

/***/ }
/******/ ]);