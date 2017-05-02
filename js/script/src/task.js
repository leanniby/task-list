;(function () {
    const PROGRESS_STEP = ['to-do', 'in-progress', 'done'];
    let $taskList = {};

    function initTasks() {
        $taskList = $('.js-task-list');
        let tasks = JSON.parse(localStorage.getItem('db')).tasks || {tasks: []};
        tasks.forEach(function (task) {
            let $task = showTask(task);
            $.data($task, 'id', task.id);
            $.data($task, 'name', task.name);
            $taskList.append($task);
        });

        $('body').on('click', '.js-task__new-task', function() {
            return $taskList.append(newTask);
        });
        $taskList.on('click', '.js-task__delete-task', deleteTask);
        $taskList.on('click', '.js-task__new-step', newStep);
        $taskList.on('click', '.js-task__delete-step', deleteStep);
        $taskList.on('click', '.js-task__up-progress', upProgress);
        $taskList.on('dblclick', '.js-text-edit', nameEdit);
    }

    function newTask() {
        let $taskList = $('.js-task-list');
        let newID = 0;
        $taskList.children('.js-task').each(function () {
            let curID = $(this).data('id');
            if (curID >= newID) {
                newID = curID+1;
            }
        });

        let task = {
            id: newID,
            name: 'Task '+(newID+1)
        };
        $taskList.append(showTask(task));
        saveDb();
    }

    function showTask(task) {
        task.steps = task.steps || [];

        let $task = $(`<article class='b-task js-task' id='task[${ task.id }]'>
                        <button class='b-task__delete-task b-button js-task__delete-task'><i class="fa fa-times fa-lg"></i></i></button>
                        <h2 class='b-task__progress js-task_progress'></h2>
                        <h2 class='b-task__title js-text-edit'>${ task.name }</h2>
                        <!--<input class='b-task__title js-text-edit' value='${ task.name }'>-->
                        <ul class='b-task__steps-list js-step-list'>
                        </ul>
                        <button class='b-button js-task__new-step'><i class="fa fa-plus-circle" aria-hidden="true"></i> New step</button>
                    </article>`);
       $task.data('id', task.id);
       $task.data('name', task.name);

        let $stepList = $task.find('.js-step-list');
        task.steps.forEach(function(step) {
            $stepList.append(showStep(step))
        });
        updateTaskProgress($task);
        return $task;
    }

    function deleteTask() {
        let $task = $(this).parent('.js-task');
        $task.remove();
        saveDb();
    }

    function updateTaskProgress($source) {
        let $task = $source.closest('.js-task');
        let $taskProgress = $task.find('.js-task_progress');
        let allSteps = $task.find('.js-step').length;
        let completeSteps = $task.find('[data-step-progress="done"]').length;
        $taskProgress.text(allSteps ? completeSteps+'/'+allSteps : '-/-');
        $task.toggleClass('b-task--complete', allSteps > 0 && allSteps === completeSteps);
    }

    function newStep() {
        let $stepList = $(this).siblings('.js-step-list');
        let newID = 0;
        $stepList.children('.js-step').each(function () {
            let curID = $(this).data('id');
            if (curID >= newID) {
                newID = curID+1;
            }
        });
        let step = {
            id: newID,
            name: 'Step '+(newID+1),
            progress: PROGRESS_STEP[0]
        };

        $stepList.append(showStep(step));
        let $task = $stepList.closest('.js-task');
        updateTaskProgress($task);
        saveDb();
    }

    function showStep(step) {
        let $step = $(`<li class='b-task__step js-step' id='step[${ step.id }]'>
                        <button class='b-task__delete-step b-button js-task__delete-step'><i class="fa fa-trash-o fa-lg"></i></button>
                        <div class='b-task__status-step'>
                            <span class='b-label js-task__up-progress' data-step-progress='${ step.progress }'></span>
                        </div>
                        <h3 class='b-task__name-step js-text-edit'>${ step.name }</h3>
                    </li>`);
        $step.data('id', step.id);
        $step.data('name', step.name);
        $step.data('progress', step.progress);

        return $step;
    }

    function upProgress() {
        let $this = $(this);
        let $task = $this.closest('.js-task');
        let oldProgress = $this.attr('data-step-progress');
        let newProgress = PROGRESS_STEP[(PROGRESS_STEP.findIndex(x => x === oldProgress) + 1) % PROGRESS_STEP.length];
        $this.attr('data-step-progress', newProgress);
        updateTaskProgress($task);
        saveDb();
    }

    function deleteStep() {
        let $this = $(this);
        let $task = $this.closest('.js-task');
        let $step = $this.closest('.b-task__step');
        $step.remove();
        updateTaskProgress($task);
        saveDb();
    }

    function nameEdit() {
        let $this = $(this);
        let $input = $(`<input type='text' value='${ $this.text() }'>`);
        $input.addClass($this.attr('class'));
        $this.hide().after($input);
        $input.focus();
        $input.on('change blur', function () {
            if ($input.val() === ''){
                $input.val('_');
            }
            $this.show().text($input.val());
            $input.remove();
            $this.closest('.js-task, .js-step').data('name', $input.val());
            saveDb();
        });
    }

    function saveDb() {
        let db = { tasks: [] };
        $taskList.find('.js-task').each(function () {
            let $this = $(this);
            let task = $this.data();
            task.steps = [];
            $this.find('.js-step').each(function () {
                let $this = $(this);
                let step = $this.data();
                task.steps.push(step);
            });
            db.tasks.push(task);
        });
        localStorage.setItem('db', JSON.stringify(db));
    }

    $(document).ready(initTasks);
} )();
