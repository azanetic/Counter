function generateCounter(i, count = 0, label = null) {
    function createLabel(l, i) {
        return l ? l : "Label" + i;
    }
    return '<div class="wrapper">' +
        '<div class="number-container">' +
        `<p class="number" id="number${i}" contenteditable tabIndex="-1" pattern="[0-9]{3}">${count}</p>` +
        '</div>' +
        `<p class="label" contenteditable="">${createLabel(label, i)}</p>` +
        '<div class="buttons-container">' +
        `<button onclick="decrement(${i})" tabIndex="-1">-</button>` +
        `<button onclick="increment(${i})" tabIndex="-1">+</button>` +
        '</div>' +
        '</div>';
}

for (let i = 0; i < 12; i++) {
    document.getElementById("main-wrapper").innerHTML += generateCounter(i);
}

for (let l of document.getElementsByClassName("label")) {
    l.addEventListener('keydown', (evt) => {
        if (evt.key === "Enter") {
            evt.preventDefault();
            return false;
        }
    });

    l.onfocus = () => {
        window.setTimeout(() => document.execCommand('selectAll', false, null), 0.1);
    }
}

for (let n of document.getElementsByClassName("number")) {
    n.addEventListener('keydown', (evt) => {
        if (evt.key === "Enter") {
            evt.preventDefault();
            return false;
        }
    });

    n.addEventListener("scroll", (evt) => {

    });

    n.onfocus = () => {
        window.setTimeout(() => document.execCommand('selectAll', false, null), 0.1);
    }

    n.addEventListener('blur', () => {
        console.log("focus out");
        if (n.innerText == "") n.innerText = "0";

        if (isNaN(n.innerText - parseInt(n.innerText))){
            n.innerText = "0";
        }
    }, true);
}
