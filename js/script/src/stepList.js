import { textEdit } from './libs'

const PROGRESS_STEP = ['to-do', 'in-progress', 'done'];
let db;

function initStepList(_db, $taskList) {
    db = _db;

    $taskList.children('.js-task').each(function () {
        let taskId = $(this).data('task-id');
        let task = db.getTask(taskId);
        let $stepList = $(this).find('.js-step-list');
        task.steps.forEach(function(step) {
            $stepList.append(showStep(step))
        });
    });

    $taskList.on('click', '.js-step__new-step', newStep);
    $taskList.on('dblclick', '.js-step__name-edit', textEdit(nameChange));
    $taskList.on('click', '.js-step__up-progress', upProgress);
    $taskList.on('click', '.js-step__delete-step', deleteStep);
}

function showStep(step) {
    let $step = $(`<li class='b-task__step js-step' data-step-id='${ step.id }'>
                    <button class='b-task__delete-step b-button js-step__delete-step' data-action='delete-step'>
                        <i class="fa fa-trash-o fa-lg"></i>
                    </button>
                    <div class='b-task__status-step'>
                        <span class='b-label js-step__up-progress'
                            data-step-progress='${ step.progress }' data-action='change-step-progress'></span>
                    </div>
                    <h3 class='b-task__name-step js-step__name-edit'>${ step.name }</h3>
                </li>`);
    return $step;
}

function newStep() {
    let taskId = $(this).closest('.js-task').data('task-id');
    let newStep = db.newStep(taskId);
    db.save();

    let $stepList = $(this).siblings('.js-step-list');
    return $stepList.append(showStep(newStep));
}

function nameChange($this, text) {
    let $step = $this.closest('.js-step');
    let stepId = $step.data('step-id');
    let $task = $step.closest('.js-task');
    let taskId = $task.data('task-id');
    db.getStep(taskId, stepId).name = text;
    db.save();
}

function upProgress() {
    let $this = $(this);
    let $step = $this.closest('.js-step');
    let stepId = $step.data('step-id');
    let $task = $step.closest('.js-task');
    let taskId = $task.data('task-id');
    let oldProgress = $this.attr('data-step-progress');
    let newProgress = PROGRESS_STEP[(PROGRESS_STEP.findIndex(x => x === oldProgress) + 1) % PROGRESS_STEP.length];

    db.getStep(taskId, stepId).progress = newProgress;
    db.save();

    $this.attr('data-step-progress', newProgress);
}

function deleteStep() {
    let $step = $(this).closest('.js-step');
    let stepId = $step.data('step-id');
    let $task = $step.closest('.js-task');
    let taskId = $task.data('task-id');
    db.deleteStep(taskId, stepId);
    db.save();
    $step.remove();
}

export { PROGRESS_STEP, initStepList };
