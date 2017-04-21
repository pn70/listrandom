// Object for generation of a random integer
function RandomInteger(low = 0, hi = 1) {

    this.low = low; // Lowest value
    this.hi  = hi;  // Highest value

    // Method for generating a random integer
    this.getRndInt = function() {
        return Math.floor(Math.random() * (this.hi - this.low + 1) ) + this.low;
    };

    this.setLow = function(newLow) { this.low = newLow; }; // Set lowest value
    this.setHi  = function(newHi)  { this.hi  = newHi;  }; // Set highest value

}

// Object for a list of strings
function UserList() {

    this.list = []; // Array of strings

    // Method for parsing a raw string and
    // adding each row as separate items in the array
    this.setList = function(userInput) {
        var rawInput = userInput.split(/\r|\n/);
        var parsedInput = rawInput.filter(Boolean);
        this.list = parsedInput.slice();
    };

    // Method for randomizing the order of items in the list
    this.shuffleList = function() {
        this.list.sort(function(a, b){return 0.5 - Math.random()});
    };

    // Method for getting list length
    this.getListLength = function() {
        return this.list.length;
    };

    // Method for getting the full list
    this.getList = function() {
        return this.list;
    };

    // Method for getting a single list item
    this.getListItem = function(index) {
        return this.list[index];
    };

    // Method for getting a single random list item
    this.getRandomListItem = function() {
        return this.list[new RandomInteger(0,this.list.length-1).getRndInt()];
    };

}

// Object for the main application
function appMain() {

    this.settingUseColours = false; // Random colour setting
    this.settingShufTime = 4000;    // List shuffle time setting
    this.settingColHue = 205;       // Background colour hue setting
    this.settingColSat = 40;        // Background colour saturation setting
    this.settingColLig = 40;        // Background colour lightness setting

    // Create the UserList
    this.theUserList = new UserList();

    // Method for clearing the textarea input
    this.clearTextarea = function() {
        document.getElementById('theList').value="";
        document.getElementById('theList').focus();
    }

    // Method for setting up the modal settings interface
    this.settingsModal = function() {

        document.getElementById("buttonSettings").onclick = function() {
            document.getElementById('settingsModal').style.display = "block";
        }

        document.getElementsByClassName("close")[0].onclick = function() {
            document.getElementById('settingsModal').style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == document.getElementById('settingsModal')) {
                document.getElementById('settingsModal').style.display = "none";
            }
        }

    }

    // Method to apply and update settings
    this.applySettings = function() {
        this.settingUseColours = (document.getElementById("useRandCol").checked) ? true : false;
        this.settingColHue = parseInt(document.getElementById("colHue").value);
        this.settingColSat = parseInt(document.getElementById("colSat").value);
        this.settingColLig = parseInt(document.getElementById("colLight").value);
        this.settingShufTime = parseInt(document.getElementById("ShufTime").value);
        document.getElementsByTagName('body')[0].style.backgroundColor =
        "hsl(" + this.settingColHue + ", " + this.settingColSat + "%, " + this.settingColLig + "%)";
    }

    // Main method for randomizing the list and showing the result
    this.showResult = function() {

        // Send textarea content to the list
        this.theUserList.setList(document.getElementById('theList').value);

        // At least two items are required
        if (this.theUserList.getListLength() < 2) {
            return;
        }

        // Shuffle the list
        this.theUserList.shuffleList();

        // Hide the main UI
        document.getElementById('interactionUI').style.opacity=0;
        setTimeout(function(){
            document.getElementById('interactionUI').style.display="none";
        }, 1000);

        // If random colours are selected, set new random hue
        // and update the modal interface
        if (this.settingUseColours) {
            var newHue = new RandomInteger(1,256).getRndInt();
            this.settingColHue = newHue;
            document.getElementById("colHue").value = newHue;
        }

        var root = this;

        var counter = 0;
        listlength = root.theUserList.getListLength();


        // Animate the list items and wait for clearTimeout
        var animateResults = setInterval(function(){

            document.getElementById('resultText').innerHTML = root.theUserList.list[counter % listlength];
            var itemFontSize = 1;
            document.getElementById('resultText').style.fontSize = itemFontSize + "vw";

            while (document.getElementById('resultText').offsetWidth < document.documentElement.clientWidth - 128 && document.getElementById('resultText').offsetHeight < document.documentElement.clientHeight / 2) {
                document.getElementById('resultText').style.fontSize = itemFontSize + "vw";
                itemFontSize +=1;
            }

            document.getElementById('resultText').style.fontSize = itemFontSize-2 + "vw";

            counter++;

        }, 20 + new RandomInteger(10,80).getRndInt());

        // Stop animation and prepare event listener to enable
        // returning to the main UI
        setTimeout(function(){
            clearTimeout(animateResults);
            document.getElementById('viewResult').addEventListener("click",
                function showUI() {
                    document.getElementById('interactionUI').style.display="block";
                    document.getElementById('interactionUI').style.opacity=1;
                    root.applySettings();
                    document.getElementById('viewResult').removeEventListener("click", showUI);
                }
            );
        }, this.settingShufTime + new RandomInteger(1000,4000).getRndInt());

    }

    // Methods called at creation
    this.settingsModal();
    this.applySettings();

}

runApp = new appMain();
