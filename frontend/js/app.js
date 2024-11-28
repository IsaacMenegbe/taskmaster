const colors = [
  '#893101',
  '#ed7117',
  '#d16002',
  '#cc5801',
  '#b56727',
  '#d67229',
];

const title = document.getElementById('taskTitle');
const desc = document.getElementById('taskDesc');
const priority = document.getElementById('priority');
const deadline = document.getElementById('deadline');
const add = document.getElementById('add');
const allTasks = document.querySelector('.allTasks');
const logOut = document.querySelector('.logOut');

// Function to create a new task
add.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    title.value === '' ||
    desc.value === '' ||
    priority.value === '' ||
    deadline.value === ''
  ) {
    alert('All fields are required');
    return;
  }

  const taskData = {
    title: title.value,
    description: desc.value,
    priority: priority.value,
    deadline: new Date(deadline.value),
  };

  fetch('http://localhost:3000/api/tasks/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Task created:', data);
      alert('Task created successfully');
      title.value = '';
      desc.value = '';
      priority.value = '';
      deadline.value = '';

      fetchAndRenderTasks(); // Re-fetch tasks after creation
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error creating the task.');
    });
});

// Fetch and render tasks when the page loads or tasks are added
window.addEventListener('load', fetchAndRenderTasks);

// Function to fetch and render tasks
function fetchAndRenderTasks() {
  fetch('http://localhost:3000/api/tasks/get-tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    })
    .then((data) => {
      renderTasks(data); // Call renderTasks to display tasks
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error fetching tasks.');
    });
}

// Function to render tasks on the page with random colors
function renderTasks(tasks) {
  allTasks.innerHTML = ''; // Clear current tasks

  tasks.forEach((task) => {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task');
    taskItem.classList.add('bright-text'); // Add bright text class for color
    taskItem.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)]; // Assign random color to task

    taskItem.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <div>
        <p>Priority: ${task.priority}</p>
        <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
      </div>
      <div>
        <span class="edit-task" data-id="${task._id}">Edit</span>
        <span class="delete-task" data-id="${task._id}">Delete</span>
      </div>
    `;
    allTasks.appendChild(taskItem);
  });

  // Add event listeners for delete and edit buttons
  const deleteButtons = document.querySelectorAll('.delete-task');
  deleteButtons.forEach((btn) =>
    btn.addEventListener('click', (e) => {
      const taskId = e.target.getAttribute('data-id');
      deleteTask(taskId);
    })
  );

  const editButtons = document.querySelectorAll('.edit-task');
  editButtons.forEach((btn) =>
    btn.addEventListener('click', (e) => {
      const taskId = e.target.getAttribute('data-id');
      editTask(taskId);
    })
  );
}

// Function to delete a task
function deleteTask(taskId) {
  fetch(`http://localhost:3000/api/tasks/delete/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      alert('Task deleted successfully');
      fetchAndRenderTasks(); // Re-fetch tasks after deletion
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error deleting the task.');
    });
}

// Function to edit a task
function editTask(taskId) {
  const newTitle = prompt('Enter new title:');
  const newDescription = prompt('Enter new description:');
  const newPriority = prompt('Enter new priority (e.g., High, Medium, Low):');
  const newDeadline = prompt('Enter new deadline (YYYY-MM-DD):');

  if (!newTitle || !newDescription || !newPriority || !newDeadline) {
    alert('All fields are required');
    return;
  }

  const updatedTask = {
    title: newTitle,
    description: newDescription,
    priority: newPriority,
    deadline: new Date(newDeadline),
  };

  fetch(`http://localhost:3000/api/tasks/update/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTask),
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      alert('Task updated successfully');
      fetchAndRenderTasks(); // Re-fetch tasks after update
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error updating the task.');
    });
}

// Log out functionality
logOut.addEventListener('click', (e) => {
  e.preventDefault();

  fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to log out');
      }
      window.location.href = '/login.html';
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error logging out.');
    });
});


// const colors = [
//   '#893101',
//   '#ed7117',
//   '#d16002',
//   '#cc5801',
//   '#b56727',
//   '#d67229',
// ];

// const gridItems = document.querySelectorAll('.task');
// const title = document.getElementById('taskTitle');
// const desc = document.getElementById('taskDesc');
// const priority = document.getElementById('priority');
// const deadline = document.getElementById('deadline');
// const add = document.getElementById('add');
// const allTasks = document.querySelector('.allTasks');
// const logOut = document.querySelector('.logOut');

// let tasksFromServer = [];

// // Function to create a new task
// add.addEventListener('click', (e) => {
//   e.preventDefault();

//   if (
//     title.value === '' ||
//     desc.value === '' ||
//     priority.value === '' ||
//     deadline.value === ''
//   ) {
//     alert('All fields are required');
//     return;
//   }

//   const taskData = {
//     title: title.value,
//     description: desc.value,
//     priority: priority.value,
//     deadline: new Date(deadline.value),
//   };

//   fetch('http://localhost:3000/api/tasks/create', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(taskData),
//     credentials: 'include',
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Failed to create task');
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log('Task created:', data);
//       alert('Task created successfully');
//       title.value = '';
//       desc.value = '';
//       priority.value = '';
//       deadline.value = '';

//       fetchAndRenderTasks();
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('There was an error creating the task.');
//     });
// });

// // Fetch and render tasks only once when the page loads
// window.addEventListener('load', fetchAndRenderTasks);

// // Function to fetch and render tasks
// function fetchAndRenderTasks() {
//   fetch('http://localhost:3000/api/tasks/get-tasks', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Failed to fetch tasks');
//       }
//       return response.json();
//     })
//     .then((data) => {
//       renderTasks(data);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('There was an error fetching tasks.');
//     });
// }

// // Function to render tasks on the page
// function renderTasks(tasks) {
//   allTasks.innerHTML = ''; // Clear current tasks
//   tasks.forEach((task) => {
//     const taskItem = document.createElement('div');
//     taskItem.classList.add('task');
//     taskItem.style.backgroundColor =
//       colors[Math.floor(Math.random() * colors.length)];
//     taskItem.innerHTML = `
//       <h3>${task.title}</h3>
//       <p>${task.description}</p>
//       <div>
//         <p>Priority: ${task.priority}</p>
//         <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
//       </div>
//       <div>
//         <span class="edit-task" data-id="${task._id}">Edit</span>
//         <span class="delete-task" data-id="${task._id}">Delete</span>
//       </div>
//     `;
//     allTasks.appendChild(taskItem);
//   });

//   // Add event listeners for delete and edit
//   const deleteButtons = document.querySelectorAll('.delete-task');
//   deleteButtons.forEach((btn) =>
//     btn.addEventListener('click', (e) => {
//       const taskId = e.target.getAttribute('data-id');
//       deleteTask(taskId);
//     })
//   );

//   const editButtons = document.querySelectorAll('.edit-task');
//   editButtons.forEach((btn) =>
//     btn.addEventListener('click', (e) => {
//       const taskId = e.target.getAttribute('data-id');
//       editTask(taskId);
//     })
//   );
// }

// // Function to delete a task
// function deleteTask(taskId) {
//   fetch(`http://localhost:3000/api/tasks/delete/${taskId}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Failed to delete task');
//       }
//       alert('Task deleted successfully');
//       fetchAndRenderTasks(); // Re-fetch tasks after deletion
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('There was an error deleting the task.');
//     });
// }

// // Function to edit a task
// function editTask(taskId) {
//   const newTitle = prompt('Enter new title:');
//   const newDescription = prompt('Enter new description:');
//   const newPriority = prompt('Enter new priority (e.g., High, Medium, Low):');
//   const newDeadline = prompt('Enter new deadline (YYYY-MM-DD):');

//   if (!newTitle || !newDescription || !newPriority || !newDeadline) {
//     alert('All fields are required');
//     return;
//   }

//   const updatedTask = {
//     title: newTitle,
//     description: newDescription,
//     priority: newPriority,
//     deadline: new Date(newDeadline),
//   };

//   fetch(`http://localhost:3000/api/tasks/update/${taskId}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updatedTask),
//     credentials: 'include',
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Failed to update task');
//       }
//       alert('Task updated successfully');
//       fetchAndRenderTasks(); // Re-fetch tasks after update
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('There was an error updating the task.');
//     });
// }

// // Log out functionality
// logOut.addEventListener('click', (e) => {
//   e.preventDefault();

//   fetch('http://localhost:3000/api/auth/logout', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Failed to log out');
//       }
//       window.location.href = '/login.html';
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('There was an error logging out.');
//     });
// });


// // const colors = [
// //   '#893101',
// //   '#ed7117',
// //   '#d16002',
// //   '#cc5801',
// //   '#b56727',
// //   '#d67229',
// // ];
// // const gridItems = document.querySelectorAll('.task');

// // gridItems.forEach((item) => {
// //   // Randomly choose a color from the colors array
// //   const randomColor = colors[Math.floor(Math.random() * colors.length)];
// //   item.style.backgroundColor = randomColor;
// // });

// // const title = document.getElementById('taskTitle');
// // const desc = document.getElementById('taskDesc');
// // const priority = document.getElementById('priority');
// // const deadline = document.getElementById('deadline');
// // const add = document.getElementById('add');
// // const allTasks = document.querySelector('.allTasks');

// // let tasksFromServer = [];

// // // function to create a new task
// // add.addEventListener('click', (e) => {
// //   e.preventDefault();

// //   if (
// //     title.value === '' ||
// //     desc.value === '' ||
// //     priority.value === '' ||
// //     deadline.value === ''
// //   ) {
// //     alert('All fields are required');
// //     return;
// //   }

// //   const taskData = {
// //     title: title.value,
// //     description: desc.value,
// //     priority: priority.value,
// //     deadline: new Date(deadline.value),
// //   };

// //   fetch('http://localhost:3000/api/tasks/create', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify(taskData),
// //     credentials: 'include',
// //   })
// //     .then((response) => {
// //       if (!response.ok) {
// //         throw new Error('Failed to create task');
// //       }
// //       return response.json();
// //     })
// //     .then((data) => {
// //       console.log('Task created:', data);
// //       alert('Task created successfully');
// //       title.value = '';
// //       desc.value = '';
// //       priority.value = '';
// //       deadline.value = '';

// //       // Optionally, call renderTasks to add the new task without reloading
// //       fetch('http://localhost:3000/api/tasks/get-tasks', {
// //         method: 'GET',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         credentials: 'include',
// //       })
// //         .then((response) => response.json())
// //         .then((data) => {
// //           renderTasks(data);
// //         });
// //     })
// //     .catch((error) => {
// //       console.error('Error:', error);
// //       alert('There was an error creating the task.');
// //     });
// // });

// // // Fetch and render tasks only once when the page loads
// // window.addEventListener('load', () => {
// //   fetch('http://localhost:3000/api/tasks/get-tasks', {
// //     method: 'GET',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     credentials: 'include',
// //   })
// //     .then((response) => {
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch tasks');
// //       }
// //       return response.json();
// //     })
// //     .then((data) => {
// //       // Call the function to render the tasks on the page
// //       renderTasks(data);
// //     })
// //     .catch((error) => {
// //       console.error('Error:', error);
// //       alert('There was an error fetching tasks.');
// //     });
// // });

// // // render tasks items
// // function renderTasks(tasks) {
// //   allTasks.innerHTML = ''; // Clear current tasks
// //   tasks.forEach((task) => {
// //     const taskItem = document.createElement('div');
// //     taskItem.classList.add('task');
// //     taskItem.style.backgroundColor =
// //       colors[Math.floor(Math.random() * colors.length)];
// //     taskItem.innerHTML = `
// //       <h3>${task.title}</h3>
// //       <p>${task.description}</p>
// //       <div> <p>Priority: ${task.priority}</p>
// //       <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p></div>
// //       <div>
// //       <span>Edit</span>
// //       <span>Delete</span>
// //       </div>
     
// //     `;
// //     allTasks.appendChild(taskItem);
// //   });
// // }

// // const logOut = document.querySelector('.logOut');

// // logOut.addEventListener('click', (e) => {
// //   e.preventDefault();

// //   fetch('http://localhost:3000/api/auth/logout', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     credentials: 'include',
// //   })
// //     .then((response) => {
// //       if (!response.ok) {
// //         throw new Error('Failed to log out');
// //       }
// //       window.location.href = '/login.html';
// //     })
// //     .catch((error) => {
// //       console.error('Error:', error);
// //       alert('There was an error logging out.');
// //     });
// // });
