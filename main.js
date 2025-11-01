import { access, 
    constants, 
    writeFileSync, 
    readFileSync, 
    existsSync,
    readdirSync,
    statSync,
} from "node:fs";
import { createInterface } from "node:readline";
import promptSync from 'prompt-sync';



const arg1 = process.argv[2] !== undefined ? process.argv[2] : "";
const arg2 = process.argv[3] !== undefined ? process.argv[3] : "";
const arg3 = process.argv[4] !== undefined ? process.argv[4].toLowerCase() : "";

console.log(arg3);

const jsonFile = "./data.json";
const prompt = promptSync()

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
argsMap.set("help", help);

const getCommand = argsMap.get(arg1);
const test = getCommand(arg2);

function Task(desc, state, createDate, updateDate) {
    this.desc = desc;
    this.state = state;
    this.createDate = createDate;
    this.updateDate = updateDate;
}


function readDataFile() {
    const jsonFile = "./data.json";
    const data = readFileSync(jsonFile, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData['tasks'];
}

function title(title) {
    console.log("====================================================");
    console.log(`${title}`);
    console.log("====================================================");
}

function taskView(task) {
    console.log(`Description: ${task.desc}`);
    console.log(`State: ${task.state}`);
    console.log(`Created At: ${task.createDate}`);
    console.log(`Updated At: ${task.updateDate}`);
    console.log("====================================================");
}

function addTask(desc) {
    const date = new Date(Date.now());
    const taskArray = readDataFile();
    const [month, day, year] = [
        date.getMonth(),
        date.getDate(),
        date.getFullYear(),
    ];
    const parseDate = `${month + 1}/${day}/${year}`;
    taskArray[taskArray.length] = new Task(desc,
                                           'TODO', 
                                           parseDate, 
                                           parseDate);
    const contents = `{"tasks": ${JSON.stringify(taskArray, null, 2)}}`;

    writeFileSync(jsonFile, contents, 'utf8');
    title("Added Task")
    taskView(taskArray[taskArray.length - 1])
}

function userInput() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    console.log("====================================================");
    return rl.question('Please Select a Task => ', (userInput) => {
        rl.close() 
    });
}

function updateTask() {
    const tasks = readDataFile();
    let count = 0;

    if(tasks.length === 0) {
        console.log(`No task to Update`)
    } else {
        title('Update Task');
        for(let task of tasks) {
            console.log(`${count}: ${task.desc} (state: ${task.state} updated at: ${task.updateDate})`);    

            count++;
        }
        const input = prompt("=> ");
        try {
            const updateTask = tasks[input]; 
            console.log(updateTask['desc']);
        } catch (error) {
            console.log(`Error: unknown Selection ${input}`); 
        }
    }
}

function help() {
    console.log("Help");
}

function deleteTask() {
    console.log('Delete Task');
}


// progress todo -> in progress -> done
function markTask(task) {
    console.log('Mark Task');
}

// filter will be all, todo, inProgress, done
function listTasks() {
    let tasks = readDataFile();
    if(tasks.length === 0) {
        console.log(`No task for Filter: ${arg2}`)
    } else {
        title(`${arg2}: Tasks List`);
        for(let task of tasks) {
            if(task.state.toLowerCase() === arg2.toLowerCase()) {
                taskView(task);
            }
            if(arg2.toLowerCase() === 'all') {
                taskView(task);
            }
        }
    }
}

