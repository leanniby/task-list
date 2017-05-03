class DB {
    constructor() {
        this.tasks = [];
    }

    connect () {
        let stringData = localStorage.getItem('db');
        if (stringData && stringData !== 'undefined') {
            this.tasks = JSON.parse(stringData).tasks || [];
        } else {
            this.tasks = [];
        }
    }

    save() {
        localStorage.setItem('db', JSON.stringify({ tasks: this.tasks }));
    }

    newTask() {
        let newId = maxID(this.tasks) + 1;
        let task = {
            id: newId,
            name: 'Task '+(newId+1),
            steps: []
        };
        this.tasks.push(task);
        return task;
    }

    getTask(id) {
        return this.tasks.find( e => e.id === id);
    }

    deleteTask(id) {
        let index = this.tasks.findIndex( e => e.id === id );
        if (index === -1) {
            return [];
        }
        return this.tasks.splice(index, 1);
    }

    newStep(taskId) {
        let task = this.getTask(taskId);
        let newId = maxID(task.steps) + 1;
        let step = {
            id: newId,
            name: 'Step '+(newId+1),
            progress: 'to-do'
        };
        task.steps.push(step);
        return step;
    }

    getStep(taskId, id) {
        let task = this.getTask(taskId);
        return task.steps.find( e => e.id === id);
    }

    deleteStep(taskId, id) {
        let task = this.getTask(taskId);
        let index = task.steps.findIndex( e => e.id === id );
        if (index === -1) {
            return [];
        }
        return task.steps.splice(index, 1);
    }
}

function maxID(arr) {
    return arr.reduce( (res, e) => e.id > res ? e.id : res, -1 );
}

export default DB;