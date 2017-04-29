const PROGRESS_STEP = ['to-do', 'in-progress', 'done'];
let db = {};

function initTasks() {
    let $taskList = $('.js-task-list');
    db = JSON.parse(localStorage.getItem('db')) || { tasks: [] };

    let tasks = db.tasks;
    tasks.forEach(showTask);

    $('.js-task__new-task').on('click', newTask);

    function newTask() {
        let newID = newId(tasks);
        tasks.push({
            id: newID,
            name: 'Task ' + newID,
            steps: []
        });
        showTask(tasks[tasks.length-1]);
    }

    function showTask(task) {
        task.steps = task.steps || [];
        let steps = task.steps;

        let $task = $(`<article class='b-task js-task' id='task[${task.id}]'>
                    <button class='b-task__delete-task b-button js-task__delete-task'><i class="fa fa-times fa-lg"></i></i></button>
                    <h2 class='b-task__progress js-task_progress'></h2>
                    <h2 class='b-task__title js-text-edit'>${ task.name }</h2>
                    <ul class='b-task__steps-list js-step-list'>
                    </ul>
                    <button class='b-button js-task__new-step'><i class="fa fa-plus-circle" aria-hidden="true"></i> New step</button>
                </article>`);
        let $taskProgress = $task.find('.js-task_progress');
        let $stepList = $task.find('.js-step-list');
        $taskList.append($task);

        $task.find('> .js-text-edit').on('dblclick', nameEdit(task));
        $task.find('.js-task__delete-task').on('click', deleteTask);
        $task.find('.js-task__new-step').on('click', newStep);
        updateTaskProgress();

        steps.forEach(showStep);
        
        function nameEdit(source) {
            return function () {
                let $this = $(this);
                $this.attr('contentEditable', 'true').focus();
                $this.on('keypress blur', function (e) {
                    if (e.which != 13 && e.which != 0)
                        return;
                    if ($this.text() == ''){
                        $this.text('_')
                    }
                    $this.attr('contentEditable', 'false');
                    source.name = $this.text();
                });
            }
        }

        function updateTaskProgress() {
            let allSteps = steps.length;
            let completeSteps = steps.filter( e => e.progress == 'done').length;
            if (!allSteps)
                $taskProgress.text(allSteps);
            else
                $taskProgress.text(completeSteps+'/'+allSteps);
            if (completeSteps == allSteps && allSteps)
                $task.addClass('b-task--complete');
            else
                $task.removeClass('b-task--complete');
        }

        function deleteTask() {
            $task.remove();
            removeByID(tasks, task.id);
        }

        function newStep() {
            let newID = newId(steps);
            steps.push({
                id: newID,
                name: 'Step '+newID,
                progress: PROGRESS_STEP[0]
            });
            showStep(steps[steps.length-1]);
        }

        function showStep(step) {
            let $step = $(`<li class='b-task__step' id='step[${step.id}]'>
                    <button class='b-task__delete-step b-button js-task__delete-step'><i class="fa fa-trash-o fa-lg"></i></button>
                    <div class='b-task__status-step'>
                        <span class='b-label js-task__up-progress' data-step-progress='${ step.progress }'></span>
                    </div>
                    <h3 class='b-task__name-step js-text-edit'>${ step.name }</h3>
                </li>`);

            $step.find('.js-task__delete-step').on('click', deleteStep);
            $step.find('.js-task__up-progress').on('click', upProgress);
            $step.find('> .js-text-edit').on('dblclick', nameEdit(step));
            $stepList.append($step);
            updateTaskProgress();

            function upProgress() {
                let $this = $(this);
                let oldProgress = $this.attr('data-step-progress');
                let newState = PROGRESS_STEP[(PROGRESS_STEP.findIndex(x => x == oldProgress) + 1) % PROGRESS_STEP.length];
                $this.attr('data-step-progress', newState);

                step.progress = newState;
                updateTaskProgress();
            }

            function deleteStep() {
                $step.remove();
                removeByID(steps, step.id);
                updateTaskProgress();
            }
        }
    }

    function saveDb() {
        localStorage.setItem('db', JSON.stringify(db));
    }

    $(window).on( 'unload', saveDb);
}

function newId(array) {
    return array.reduce( (res,e) => e.id > res ? e.id : res, -1) + 1;
}

function removeByID(array, id) {
    return array.splice(array.findIndex( e => id == e.id) ,1);
}

$(document).ready(initTasks);
