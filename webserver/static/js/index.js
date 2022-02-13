

grid = document.getElementById("grid")
message = document.getElementById("message")
box = document.getElementById("box")
statsButton = document.getElementById("stats-button")
statsOuter = document.getElementById("stats-outer")

var words = []

colors = [
    "rgb(58, 58, 60)",
    "rgb(181, 159, 59)",
    "rgb(83, 141, 78)"
]

let timer;
let reloadTimer;

async function doTimer() {
    clearTimeout(timer);
    // Sets new timer that may or may not get cleared
    timer = setTimeout(async () => {
        await postWords(row=row)
    }, 1000);
}


function enableRow(row=0) {
    arr = Array(5 * 6).splice(0, (row+1)*5)

    for (i of arr.keys()) {

        gridItem = document.getElementById(i)
        inputField = document.getElementById(`${i}-input`)

        gridItem.classList = "grid-item"
        inputField.disabled = false
        gridItem.oncontextmenu = onContextMenu

        gridItem.style.backgroundColor = colors[0]

    }

    for (word of words) {
        if (!word.input.disabled) word.item.style.backgroundColor = colors[word.state]
    }
    
}

async function onContextMenu(e) {
    e.preventDefault()
    id = parseInt(e.target.id.replace("-input", ""))
    elemCtx = document.getElementById(id)
    row = Math.floor(id/5)
    
    if (words[id].state == 0) {
        words[id].state = 1
    } else if (words[id].state == 1 ) {
        console.log("is")
        words[id].state = 2
    } else if (words[id].state == 2) {
        words[id].state = 0
    }

    for (word of words) {
        if (!word.input.disabled) word.item.style.backgroundColor = colors[word.state]
    }
    doTimer()
    
    
}



var mouseTimer;
function mouseDown(e) { 
    mouseUp();
    mouseTimer = window.setTimeout(
        function() {
            e.preventDefault();
            onContextMenu(e)
        },500
    ); //set timeout to fire in 2 seconds when the user presses mouse button down
}

function mouseUp(e) { 
    if (mouseTimer) {
        window.clearTimeout(mouseTimer)
    } 
}
    
letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

async function buttonOnClick(e) {
    row = parseInt(e.target.id.replace("-button", "").replace("row-", ""))
    console.log((row*5)+5)
    

    await startForMe(row=row)

    document.getElementById(`${(row*5)+5}-input`).focus()
}

function init() {
    for (i of Array(5 * 6).keys()) {
        // Grid item
        gridItem = document.createElement("div")
        gridItem.id = i
    
        inputField = document.createElement("input")
        inputField.classList = "grid-item-input"
        inputField.id = `${i}-input`
        inputField.maxLength = 1
    
        row = Math.floor(i/5)
    
        gridItem.addEventListener("touchstart", function(e) {mouseDown(e)});
        document.body.addEventListener("touchend", function(e) {mouseUp(e)});
    
        inputField.onfocus = async function(e) {
            id = parseInt(e.target.id.replace("-input", ""))
            row = Math.floor(id/5)
    
            for (i of Array(5).keys()) {
                document.getElementById(`row-${i}-button`).style.opacity = "0%"
                document.getElementById(`row-${i}-button`).onclick = null
                document.getElementById(`row-${i}-button`).style.cursor = "default"
            }
    
            rowButton = document.getElementById(`row-${row}-button`)
            rowButton.onclick = buttonOnClick
            rowButton.style.cursor = "pointer"
            rowButton.style.opacity = "100%"
        }
    
        gridItem.onkeydown = async function(e) {
            if (e.key == "Control" || e.key == " " || e.key == "Option" || e.key == "Alt") {
                e.preventDefault();
            }
        }
    
        gridItem.onkeyup = async function(e) {
            doTimer()
            id = parseInt(e.target.id.replace("-input", ""))
            elem = document.getElementById(id)
            input = document.getElementById(`${i}-input`)
    
            row = Math.floor(id/5)
            rowCounter = 0
            for (i of Array(5 * 6).keys()) {
                if (input.value != "") rowCounter += 1;
            } 
            
            enableRow(row=row+1)
    
            if (e.key == "Backspace") {
                document.getElementById(`${id-1}-input`).focus()
            } else if (e.key == "ArrowLeft") {
                document.getElementById(`${id-1}-input`).focus()
            } else if (e.key == "ArrowRight") {
                document.getElementById(`${id+1}-input`).focus()
            }
            else if (e.key == "Control" || e.key == " " || e.key == "Option" || e.key == "Alt") {
                onContextMenu(e)
            } else if (letters.includes(e.key.toLowerCase())) {
                addLocal("letters", 1)
                document.getElementById(`${id+1}-input`).focus()
            } else {
                return
            }
        }

        if (row > 0) {
            // Under top row 
            inputField.disabled = true
            gridItem.classList = "grid-item disabled"
        } else {
            // Top row
            gridItem.style.backgroundColor = colors[0]
            gridItem.classList = "grid-item"
    
            gridItem.oncontextmenu = onContextMenu
        }

        gridItem.appendChild(inputField)
        grid.appendChild(gridItem)
    
        if ((i-4) % 5 == 0) {
            row = Math.floor(i/5)
    
            gridButton = document.createElement("div")
            gridButton.id = `row-${row}-button`
            gridButton.innerHTML = `<div id="row-${row}-button" style="margin-top:22px">Auto Fill</div>`
            gridButton.style.opacity = "0%"
            gridButton.classList = "grid-button"
            gridButton.style.backgroundColor = colors[2]
            gridButton.style.cursor = "default"
    
            grid.appendChild(gridButton)
        }
    
        words.push({
            grid:grid,
            input:inputField,
            item:gridItem,
            state: 0,
            wordIndex: i % 5
        })
    }

    document.getElementById("0-input").focus()
}

init()





if (OSName == "Mobile") {
    document.getElementById("header").style.display = "none"
    document.getElementById("help-mobile").style.opacity = "100%"
    grid.style.top = "400px"
    box.style.top = "1100px"
    box.style.left = "calc(50% - 250px)"

    statsOuter.style.left ="-225px"
    

    statsButton.style.bottom = "125px"

} else {
    document.getElementById("help-desktop").style.opacity = "100%"
    box.style.right = "10%"
    grid.style.left = "10%"
    statsButton.style.bottom = "-125px"
    statsOuter.style.right ="-225px"
    
}

function animateValue(id, start, end, duration) {
    if (!start) start = 0
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = Math.floor((end > start? 1 : -1) * ((end-start) / 263) ) ;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current.toLocaleString();
        if (current >= end) {
            clearInterval(timer);
        }
    }, stepTime);
}

statsBox = document.getElementById("stats-box")
bg = document.getElementById("bg")

async function toggleStats() {
    if (statsBox.style.height == "800px") {
        // Box is enlarged
        function doClose() {
            statsBox.style.height = "100px"
            bg.style.opacity = "50%"
            statsBox.style.overflowX = "hidden"
            statsBox.style.overflowY = "hidden"

            setTimeout(function() {
                
                bg.style.opacity = "0%"
                statsBox.style.width = "0px"
                statsBox.style.left = "-200px"
                statsBox.style.opacity = "0%"

                setTimeout(function() {
                    bg.style.width = "0%"
                    bg.style.height = "0%"
                    
                }, 500)
                
            }, 500)
        }
        if (statsOuter.style.opacity == 1) {
            statsOuter.style.opacity = 0
            setTimeout(doClose, 250)
        } else {
            statsOuter.style.opacity = 0
            doClose()
        }
    } else {
        processStats()
        

        statsBox.style.opacity = "100%"
        bg.style.width = "100%"
        bg.style.height = "100%"
        bg.style.opacity = "50%"

        if (window.innerWidth < 1500) {  statsBox.style.left = "0px"
        } else { statsBox.style.left = "-900px" }

        statsBox.style.width = "700px"
        
        setTimeout(function() {
            statsBox.style.height = "800px"
            bg.style.opacity = "100%"
            setTimeout(function() {
                statsBox.style.overflowY = "visible"
                statsBox.style.overflowX = "visible"
            }, 500)
        }, 500)

        await getStats()
        processStats()
    }
}

function getLocal(key) {
    lc = JSON.parse(statsCache.local)
    if (!lc[key]) return 0
    return lc[key]
}

function addLocal(key, amount) {
    lc = JSON.parse(statsCache.local)

    if (!lc[key]) lc[key] = 0

    lc[key] += amount 

    localStorage.stats = JSON.stringify(lc)
    statsCache.local = JSON.stringify(lc)
}

function individualLettersPopUp(e) {
    e.preventDefault()
    
    if (statsOuter.style.opacity != 1) {
        statsOuter.style.opacity = "100%"

        lettersData = `<ul>`
        for (letter in statsCache.global.individualLetters) {
            lettersData += `<li>${letter}: ${statsCache.global.individualLetters[letter].toLocaleString()}</li>`
        }
        lettersData += `</ul>`

        statsOuter.innerHTML = lettersData
    } else {
        statsOuter.style.opacity = "0%"
    }
}

async function processStats() {
    document.getElementById("stats-global-games").innerText = statsCache.global.games .toLocaleString()
    document.getElementById("stats-global-letters").innerHTML = statsCache.global.letters.toLocaleString()
    document.getElementById("stats-global-letters").onclick = individualLettersPopUp

    document.getElementById("stats-local-words").innerText = getLocal("words").toLocaleString()
    document.getElementById("stats-local-letters").innerText = getLocal("letters").toLocaleString()

}

async function getStats() {
    data = await get("/api/stats")

    statsCache.global = data

}

async function reload() {
    grid.innerHTML = ``
    message.innerHTML = ``
    words = []
    init()
    await post("/api/addGame", {})
}

async function end() {
    //window.location.reload()
    clearTimeout(reloadTimer);
    // Sets new timer that may or may not get cleared
    reloadTimer = setTimeout(async () => {
        await reload()
    }, 500);
    
}

async function startForMe(row=0) {

    data = {}
    data.words = []
    data.row = row

    for (word of words) {
        data.words.push({value:word.input.value, state:word.state, wordIndex:word.wordIndex})
    }

    resp = await post("/api/autoFillRow", data)

    if (resp.word) {
        addLocal("letters", 5)
        rowIndexes = [(row*5), (row*5)+1, (row*5)+2, (row*5)+3, (row*5)+4]

        counter = 0
        for (i of rowIndexes) {
            document.getElementById(`${i}-input`).value = resp.word[counter]
            counter += 1
        }

        doTimer()
        enableRow(row+1)
    }

}

async function postWords(row=0) {

    message.innerHTML = ""

    data = {}
    data.words = []

    for (word of words) {
        data.words.push({value:word.input.value, state:word.state, wordIndex:word.wordIndex})
    }

    resp = await post("/api/doWords", data)

    examples = ""
    likely = ""
    for (word of resp.words) {
        examples += `${word}<br>`
    }
    for (word of resp.likely) {
        likely += `${word}<br>`
    }

    addLocal("words", resp.length)
    message.innerHTML = `
        <span class="title">${resp.length} total (${Math.round((resp.length/resp.total)*100*100)/100}%) </span>
        <br>
        <span class="description" style="width:50%;height:100%;position:absolute;top:60px;"><span class="title">Standard</span><br>${examples}</span>
        <div class="description" style="width:50%;height:100%;position:absolute;right:0;top:60px;"><span class="title">Likely</span><br>${likely}</div>
    `
}
