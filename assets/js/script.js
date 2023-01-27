$(document).ready(function () {

// Selector to display today's date
    const currentDate = $("header #currentDay");

// declare object to store calendar events
    let calEvents = {};

// Check the last rendered calendar 
    let hour = moment();

// Render the calendar on the page
    let calendar = $("div.container"); 

    function renderCalendar(today, calEvents) {

        let rowHour = moment(today).hour(9); 

        calendar.empty(); 

        for (let i = 0; i < 9; i++) {
            const row = $("<div>").addClass("row");
            // set colors for time blocks for past, present and future and set class according to time rendered
            let classOfHour = "";
            if (today.isBefore(rowHour, "hour")) {
                classOfHour = "future"
            } else if (today.isAfter(rowHour, "hour")) {
                classOfHour = "past"
            } else {
                classOfHour = "present"
            };

            calendar.append(row);
            row.append($("<div>").addClass("col-2 hour").text(rowHour.format("h A")));
            let timeBlock = rowHour.format("hA");
            row.append($("<textarea>").addClass(`col-8 ${classOfHour}`).text(calEvents[timeBlock]));
            row.append($("<button>").addClass("col-2 saveBtn").html("<i class='fas fa-save'></i>").attr("aria-label", "Save").attr("id", rowHour.format("hA")));
            rowHour.add(1, "hour");
            hourRendered = moment();
        };
    };

    function initCalendar() {
        const today = moment();
        currentDate.text(today.format('LL'));
        renderCalendar(today, calEvents);
    };

// Loads events from local storage
    function loadCal() {
        const storedCal = JSON.parse(localStorage.getItem("calEvents"));
        if (storedCal) {
            calEvents = storedCal;
        };
    };

// When the page loads, execute the following function
    loadCal(); 
    initCalendar(); 
    hourTracker(); 


// Checks current time against rendered time to see if the colour need to change
    function hourTracker() {
        const checkHourInterval = setInterval(function () {
            if (moment().isAfter(hour, "minute")) {
                initCalendar(); 
            }
        }, 60000);
    };


// Store calendar events in local storage
    function storeCal() {
        localStorage.setItem("calEvents", JSON.stringify(calEvents));
    };


// Clear the calendar of all events
    function clearCalendar() {
        calEvents = {};
        storeCal();
        initCalendar();
    };

// On click clear event
    let clearButton = $("<button>");
    clearButton.text("Clear event")
    calendar.append(clearButton);
    clearButton.on("click", clearCalendar);


// On click store event in local storage
    $(document).on("click", "button.saveBtn", function (event) {
        let calDesc = event.currentTarget.parentElement.children[1].value; 
        calEvents[event.currentTarget.id] = calDesc; 
        storeCal(); 
    });

});