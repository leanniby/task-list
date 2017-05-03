import { textEdit } from './libs'
import { PROGRESS_STEP, initStepList } from './stepList'

let $taskList = {};
let db;

function initTaskList(_db) {
    db = _db;
    let tasks = db.tasks;

    $taskList = $('.js-task-list');
    tasks.forEach(function (task) {
        $taskList.append(showTask(task));
    });

    $('body').on('click', '.js-task__new-task', newTask);
    initStepList(_db, $taskList, updateTaskProgress);
    $taskList.on('click', '.js-task', deleteTask);
    $taskList.on('click', '.js-task', function (event) {
        return updateTaskProgress($(this), $(event.target).data('action'));
    });
    $taskList.on('dblclick', '.js-task__edit-name', textEdit(nameChange));
}

function showTask(task) {
    task.steps = task.steps || [];

    let $task = $(`<article class='b-task js-task' data-task-id='${ task.id }'>
                    <button class='b-task__delete-task b-button js-task__delete-task' data-action='delete-task'>
                        <i class="fa fa-times fa-lg"></i></i>
                    </button>
                    <h2 class='b-task__progress js-task_progress'></h2>
                    <h2 class='b-task__title js-task__edit-name' data-action='edit-name-task'>${ task.name }</h2>
                    <!--<input class='b-task__title js-text-edit' value='${ task.name }'>-->
                    <ul class='b-task__steps-list js-step-list'>
                    </ul>
                    <button class='b-button js-step__new-step' data-action='add-step'>
                        <i class="fa fa-plus-circle" aria-hidden="true"></i> New step
                    </button>
                </article>`);
    updateTaskProgress($task, 'change-step-progress');
    return $task;
}

function newTask() {
    let newTask = db.newTask();
    db.save();
    return $taskList.append(showTask(newTask));
}

function nameChange($this, text) {
    let taskId = $this.closest('.js-task').data('task-id');
    db.getTask(taskId).name = text;
    db.save();
}

function deleteTask(event) {
    let $task = $(this);
    let action = $(event.target).data('action');
    if (action === 'delete-task') {
        db.deleteTask($task.data('task-id'));
        db.save();
        $task.remove();
    }
}

function updateTaskProgress($task, action) {
    let taskId = $task.data('task-id');
    if (['delete-step', 'add-step', 'change-step-progress'].includes(action)) {
        let $taskProgress = $task.find('.js-task_progress');
        let progress = db.getProgressTask(taskId);
        $taskProgress.text(progress.all ? progress.complete + '/' + progress.all : '-/-');
        $task.toggleClass('b-task--complete', progress.all > 0 && progress.all === progress.complete);
    }
}

export { initTaskList }
