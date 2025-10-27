import { access, 
    constants, 
    writeFileSync, 
    readFileSync, 
    existsSync,
    readdirSync,
    statSync
} from "node:fs";


const arg1 = process.argv[2];
const arg2 = process.argv[3];
const jsonFile = "./data.json";

try {
    if (!existsSync(jsonFile)) {
        writeFileSync(jsonFile, '{"tasks": []}', 'utf8');
        console.log("Created file data.json");
    }
} catch (err) {
    console.error(err);
}

const argsMap = new Map();
argsMap.set("add", addTask);
argsMap.set("update", updateTask);
argsMap.set("delete", deleteTask);
argsMap.set("mark", markTask);
argsMap.set("list", listTasks);

const getCommand = argsMap.get(arg1);
const test = getCommand(arg2);


function Task(desc, state, date) {
    this.desc = desc;
    this.state = state;
    this.date = date;
}


function addTask(desc) {
    const data = readFileSync(jsonFile, 'utf8');
    const jsonData = JSON.parse(data);
    const date = new Date(Date.now());
    const taskArray = jsonData['tasks']
    const [month, day, year] = [
        date.getMonth(),
        date.getDate(),
        date.getFullYear(),
    ];
    const parseDate = `${month + 1}/${day}/${year}`
    taskArray[taskArray.length] = new Task(desc, 'TO_DO', parseDate);
    const contents = `{"tasks": ${JSON.stringify(taskArray, null, 2)}}`;

    writeFileSync(jsonFile, contents, 'utf8');
    console.log("====================================================");
    console.log(" Added TODO");
    console.log("====================================================");
    console.log(`Description: ${taskArray[taskArray.length - 1].desc}`);
    console.log(`State: ${taskArray[taskArray.length - 1].state}`);
    console.log(`Date: ${taskArray[taskArray.length - 1].date}`);
    console.log("====================================================");
}

function updateTask() {
    console.log('Update Task');
}

function deleteTask() {
    console.log('Delete Task');
}


// progress todo -> in progress -> done
function markTask(task) {
    console.log('Mark Task');
}

// filter will be all, todo, inProgress, done
function listTasks(filter = 'inProgress') {
    console.log('List Task');
    console.log(filter);
}

