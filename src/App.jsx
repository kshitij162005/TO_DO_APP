import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ListTodo,
  Moon,
  Sun,
  TrendingUp,
  Plus,
  X,
  Bell,
  AlertCircle,
} from "lucide-react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the Q1 project proposal for client review",
      completed: false,
      category: "work",
      timeSlot: "09:00-10:30",
      reminder: new Date(new Date().setHours(9, 0, 0, 0)),
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Morning workout",
      description: "Morning cardio and strength training",
      completed: true,
      category: "health",
      timeSlot: "07:00-08:00",
      createdAt: new Date(),
    },
  ]);
  const [time, setTime] = useState(new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    category: "work",
  });
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      // Check for reminders
      tasks.forEach((task) => {
        if (task.reminder && !task.completed) {
          const reminderTime = new Date(task.reminder);
          if (
            reminderTime.getHours() === now.getHours() &&
            reminderTime.getMinutes() === now.getMinutes() &&
            now.getSeconds() === 0
          ) {
            showNotification(task.title);
          }
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tasks]);

  const showNotification = (taskTitle) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Task Reminder", {
        body: `Don't forget: ${taskTitle}`,
        icon: "/vite.svg",
      });
    } else if (
      "Notification" in window &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (!newTask.title) return;

    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || "",
      completed: false,
      category: newTask.category || "work",
      timeSlot: newTask.timeSlot,
      reminder: newTask.reminder ? new Date(newTask.reminder) : undefined,
      createdAt: new Date(),
    };

    setTasks([...tasks, task]);
    setNewTask({ category: "work" });
    setIsAddingTask(false);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (activeFilter === "pending") return !task.completed;
      if (activeFilter === "completed") return task.completed;
      return true;
    })
    .sort((a, b) => {
      if (a.timeSlot && b.timeSlot) {
        return a.timeSlot.localeCompare(b.timeSlot);
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const progressPercentage = Math.round(
    (tasks.filter((t) => t.completed).length / tasks.length) * 100
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Focus Hub
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition-colors duration-300 ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {darkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {/* Time Widget */}
          <div
            className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Current Time</h2>
            </div>
            <p className="text-4xl font-bold">{time.toLocaleTimeString()}</p>
          </div>

          {/* Progress Widget */}
          <div
            className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold">Daily Progress</h2>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="transition-all duration-500 ease-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                />
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">
                  {progressPercentage}% Complete
                </span>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div
            className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold">Calendar</h2>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">
                {time.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <p className="text-4xl font-bold mt-2">{time.getDate()}</p>
              <p className="text-lg mt-2">
                {time.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div
          className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ListTodo className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold">Tasks</h2>
            </div>
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>

          {/* Task Filters */}
          <div className="flex gap-4 mb-6">
            {["all", "pending", "completed"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  activeFilter === filter
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Task List */}
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-102 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="focus:outline-none"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p
                        className={`text-sm mt-1 ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-2 text-sm">
                      {task.timeSlot && (
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {task.timeSlot}
                        </span>
                      )}
                      {task.reminder && (
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Bell className="w-4 h-4" />
                          {new Date(task.reminder).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setTasks(tasks.filter((t) => t.id !== task.id))
                    }
                    className="text-red-500 focus:outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white p-6 rounded-xl shadow-lg w-full max-w-md ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Add Task</h3>
              <button
                onClick={() => setIsAddingTask(false)}
                className="text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="task-title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="task-title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="task-description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="task-category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="task-category"
                value={newTask.category}
                onChange={(e) =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md"
              >
                <option value="work">Work</option>
                <option value="health">Health</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="task-time"
                className="block text-sm font-medium text-gray-700"
              >
                Time Slot
              </label>
              <input
                type="text"
                id="task-time"
                value={newTask.timeSlot}
                onChange={(e) =>
                  setNewTask({ ...newTask, timeSlot: e.target.value })
                }
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md"
                placeholder="e.g., 09:00-10:30"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="task-reminder"
                className="block text-sm font-medium text-gray-700"
              >
                Reminder
              </label>
              <input
                type="time"
                id="task-reminder"
                value={
                  newTask.reminder
                    ? new Date(newTask.reminder).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
                onChange={(e) =>
                  setNewTask({ ...newTask, reminder: e.target.value })
                }
                className="w-full p-2 mt-1 text-gray-900 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={addTask}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
