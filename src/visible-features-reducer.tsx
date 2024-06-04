export default function tasksReducer(tasks, action) {
    switch (action.type) {
      case 'changed': {
        return tasks.map((t) => {
          if (t.id === action.task.id) {
            return action.task;
          } else {
            return t;
          }
        });
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  