import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CSSTransition, TransitionGroup } from "react-transition-group";

function App() {
  const [tasks, setTasks] = useState([]);
  const [tasksCompleted, settasksCompleted] = useState([]);
  const [newTask, setnewTask] = useState("");
  const [active, setactive] = useState("tab-ongoing");

  const fetchAPI = async () => {
    const response = await axios
      .get("https://juan1994.pythonanywhere.com/api/task-list")
      .then((response) => {
        setTasks(response.data.filter((t) => t.completed !== true));
        settasksCompleted(response.data.filter((t) => t.completed === true));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const submitTask = (event) => {
    event.preventDefault();
    if (newTask) {
      let add = { title: newTask, completed: false };
      axios
        .post("https://juan1994.pythonanywhere.com//api/task-create", add)
        .then((response) => {
          if (response.status == 201) {
            add = response.data;
            setTasks(tasks.concat(add));
            setnewTask("");
          }
        })
        .catch((error) => {
          toast.error("Server is not up.");
        });
    }
  };

  const handleChange = (event) => {
    setnewTask(event.target.value);
    //console.log(tasks)
    //console.log(tasksCompleted)
  };

  const deleteTask = (event, id, type) => {
    event.preventDefault();
    console.log("wtf");
    if (confirm("Realmente deseas eliminar esta tarea?") == true) {
      axios
        .delete(`https://juan1994.pythonanywhere.com//api/task-detail/${id}`)
        .then((response) => {
          if(type===1) {
            setTasks(tasks.filter((t) => t.id !== id));
          } else {
            settasksCompleted(tasksCompleted.filter((t) => t.id !== id));
          }
          console.log(`Deleted post with ID ${id}`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const completeTask = (e, task) => {
    e.preventDefault();
    if (confirm(`Completar tarea ${task.id}`) == true) {
      let update = { title: task.title, completed: true };
      axios
        .put(`https://juan1994.pythonanywhere.com//api/task-detail/${task.id}`, update)
        .then((response) => {
          setTasks(tasks.filter((t) => t.id !== task.id));
          task.completed = true;
          settasksCompleted(tasksCompleted.concat(task));
          console.log(tasksCompleted);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleTab = (event) => {
    setactive(event.target.id)
  }

  return (
    <>
      <div className="container">
        <div className="new-task">
          <form onSubmit={submitTask} method="post">
            <input
              type="text"
              value={newTask}
              placeholder="Añadir nueva tarea"
              onChange={handleChange}
            />
            <button className="btn btn-save" type="submit">
              Agregar
            </button>
          </form>
        </div>
        <div className="list-tasks">
          <div className="tabs">
            <button className={`${active === 'tab-ongoing'? 'active': ''}`} id="tab-ongoing" onClick={handleTab}>
              Tareas Pedientes
            </button>
            <button className={`${active === 'tab-completed'? 'active': ''}`} id="tab-completed" onClick={handleTab}>
              Tareas Completadas
            </button>
          </div>
          <div className="tab-contents">
            <div className={`tab-page ${active === 'tab-ongoing'? 'active': ''}`}>
              <h2>Tareas activas</h2>
              <TransitionGroup component="ul">
                {tasks.map((task, index) => {
                  return (
                    <CSSTransition
                      key={index}
                      timeout={700}
                      classNames="item"
                      className="task-item"
                    >
                      <li className="task-item">
                        {task.title}
                        <div className="buttons">
                          <button
                            className="btn-actions"
                            onClick={(e) => completeTask(e, task)}
                          >
                            <FontAwesomeIcon
                              className="delete-button"
                              icon="fa-check"
                            />
                          </button>
                          <button
                            className="btn-actions"
                            onClick={(e) => deleteTask(e, task.id, 1)}
                          >
                            <FontAwesomeIcon
                              className="delete-button"
                              icon="fa-trash"
                            />
                          </button>
                        </div>
                      </li>
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            </div>
            <div className={`tab-page ${active === 'tab-completed'? 'active': ''}`} id="task-completed">
              <h2>Tareas Completadas</h2>
              <TransitionGroup component="ul">
                {tasksCompleted.map((task, index) => {
                  return (
                    <CSSTransition
                      key={index}
                      timeout={700}
                      classNames="item"
                      className="task-item"
                    >
                      <li className="task-item">
                        {task.title}
                        <div className="buttons">
                          <button
                            className="btn-actions"
                            onClick={(e) => deleteTask(e, task.id, 2)}
                          >
                            <FontAwesomeIcon
                              className="delete-button"
                              icon="fa-trash"
                            />
                          </button>
                        </div>
                      </li>
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
