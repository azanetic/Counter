class Change {
    constructor(i, inc) {
        this.i = i;
        this.inc = inc;
    }
}

var changes = [];

var selectedCounter = 0;

var ctrlDown  = false;
var shiftDown = false;

function applyOperation(i, inc){
    number = document.getElementById("number" + i);
    text = number.innerText;
    number.innerText = (parseInt(text) + inc);

    window.localStorage.setItem('cache', document.getElementById("main-wrapper").innerHTML);
}

function undo() {
    if (changes.length == 0) return;

    const change = changes.pop();

    applyOperation(change.i, -change.inc);
}

function performOperation(i, inc) {
    if (i == -1) return;

    if(shiftDown) inc *= 5;
    if(ctrlDown) inc *= -1;

    changes.push(new Change(i, inc));

    applyOperation(i, inc);
}

function increment(i, e) {
    performOperation(i, 1, e);
}

function decrement(i, e) {
    performOperation(i, -1, e);
}

document.addEventListener('keyup', keyUp);
document.addEventListener('keydown', keyDown);

function keyDown(e){
    if(e.code === "ShiftLeft") shiftDown = true;
    if(e.code === "ControlLeft") ctrlDown = true;
}

function keyUp(e) {
    console.log(e.code);

    if(e.code === "ControlLeft"){
        ctrlDown = false;
        return;
    }

    if(e.code === "ShiftLeft"){
        shiftDown = false;
        return;
    }

    if (e.code === "Enter") {
        if (document.activeElement.className === "label" || document.activeElement.className === "number") {
            document.activeElement.blur();
            e.preventDefault();
            return false;
        }

        // document.getElementsByClassName("label")[selectedCounter].focus();
    }

    if (document.activeElement.className === "label" || document.activeElement.className === "number") return;

    if (e.code == "Backspace") {
        undo();
        return;
    }

    if (e.code === "KeyO") {
        exportData();
        return;
    }

    if (e.code === "KeyI") {
        importData();
        return;
    }

    if (e.code === "KeyL") {
        importFromLocalStorage();
        return;
    }

    // if (e.code === "ArrowLeft") decrement(selectedCounter);
    // if (e.code === "ArrowRight") increment(selectedCounter);

    // if (e.code === "KeyA" || e.code === "KeyS") decrement(selectedCounter);
    // if (e.code === "KeyD" || e.code === "KeyW") increment(selectedCounter);

    // for (let i = 0; i <= 9; i++) {
    //     if (e.code === "Digit" + i) {
    //         if (i === 0) selectedCounter = -1;
    //         else selectedCounter = i - 1;
    //         break;
    //     }
    // }

    for (let i = 0; i <= 9; i++) {
        if (e.code === "Digit" + i) {
            increment(i - 1);
            break;
        }
    }

    for (let i = 0; i <= 9; i++) {
        if (e.code === "Numpad" + i) {
            increment(i - 1);
            break;
        }
    }
}

const copyToClipBoard = (str) =>
{
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const notif = document.createElement("p");
    notif.innerText = "Copied to clipboard!";
    notif.style.position = "fixed";
    notif.style.bottom = "0";
    notif.style.width = "100%";
    notif.style.backgroundColor = "rgba(0,0,0,0.5)";
    notif.style.padding = "20px";

    document.body.appendChild(notif);

    setTimeout(() => document.body.removeChild(notif), 1600);

};

function exportData() {
    const wrappers = document.getElementsByClassName("wrapper");

    let exportMessage = "";

    for(let i = 0; i < wrappers.length; i++){
        const w = wrappers[i];

        const count = w.children[0].children[0].innerText;
        const label = w.children[1].innerText;

        exportMessage += count + "###" + label;

        if( i < wrappers.length - 1){
            exportMessage += "___";
        }
    }

    copyToClipBoard(exportMessage);
}

function importData() {
    const exportMessage = window.prompt("Paste import text inside", "");

    document.getElementById("main-wrapper").innerHTML = "";

    let i = 0;
    for(let token of exportMessage.split("___")){
        const tokens = token.split("###");

        const count = parseInt(tokens[0]);
        const label = tokens[1];

        document.getElementById("main-wrapper").innerHTML += generateCounter(i++, count, label );
    }
}

function importFromLocalStorage(){
    document.getElementById("main-wrapper").innerHTML = window.localStorage.getItem('cache');
}