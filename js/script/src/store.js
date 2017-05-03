import { initTaskList } from './taskList';
import DB from './db'

$(document).ready(function (){
    let db = new DB();
    db.connect();
    initTaskList(db)
});
