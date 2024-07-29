
export default class Planner {
    constructor(container, config) {
        if (typeof container === "string") {
            container = document.querySelector(container);
        }

        if (typeof container === "undefined") {
            throw new Error("Container is undefined");
        }

        this.container = container;
        if(typeof config === "object"){
            this.config = config;
        }
        this.currentDate = new Date(2024, 6, 15),
        this.prevBtn = container.querySelector(".prevBtn"),
        this.nextBtn = container.querySelector(".nextBtn"),
        this.todayBtn = container.querySelector(".todayBtn"),
        this.datePicker = container.querySelector(".datePicker")

        this.startCoords = {
            x: 0,
            y: 0,
        };

        this.endCoords = {
            x: 0,
            y: 0,
        };

        this.currentResource = null;

        this.addEvent = this.config.addEvent;
        this.showEvent = this.config.showEvent;
    }

    init(){
        this.createContainer();
        this.displayScheduler(this.currentDate, this.config.resources);
    }

    createContainer() {
        const container = document.createElement("div");
        container.classList.add("planner-container");
        container.style.width = this.config.width;
        container.style.height = this.config.height;
        container.style.backgroundColor = "#ffffff";
        container.style.border = "1px solid #ccc";
        container.style.borderRadius = "16px";
        container.style.padding = "10px";
        container.style.boxShadow = "0 0 80px 0 rgba(0, 0, 0, 0.03)";
        this.createHeader(container);
        this.createTable(container);
        this.container.appendChild(container);
    }

    createHeader(container) {
        const header = document.createElement("div");
        header.classList.add("header");
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.justifyContent = "space-between";
        header.style.margin = "10px";
        header.innerHTML = `<div class="monthSwitch">
                                <button class="prevBtn"
                                        style="padding: 0.4375rem 0.75rem; background-color: #E9ECEF; border: 1px solid #dfdfdff5; border-radius: 4px; margin-right: 5px">&lt;</button>
                                <button class="nextBtn"
                                        style=" padding: 0.4375rem 0.75rem; background-color: #E9ECEF; border: 1px solid #dfdfdff5; border-radius: 4px; margin-left: 5px">&gt;</button>
                            </div>
                            <span class="monthYear"
                                  style="font-size: 20px; margin-left: 10px">Month Year</span>
                            <div class="rightBtns" style="display: flex; align-items: center; justify-content: space-between; margin-left: 10px">
                                <div class="datePicker">
                                    <input type="date"
                                           class="datePicker"
                                           style="padding: 0.4375rem 0.75rem; background-color: #E9ECEF; border: 1px solid #dfdfdff5; border-radius: 4px; margin-left: 5px"
                                           value="">
                                </div>
                                <button class="todayBtn"
                                        style="padding: 0.4375rem 0.75rem; background-color: #E9ECEF; border: 1px solid #dfdfdff5; border-radius: 4px; margin-left: 5px">Today</button>
                            </div>`;
        container.appendChild(header);
    }

    createTable(container) {
        const tableContainer = document.createElement("div");
        tableContainer.classList.add("table-container");
        tableContainer.style.overflowX = "auto";
        tableContainer.style.paddingBlock = "15px";
        const table = document.createElement("table");
        table.classList.add("scheduleTable");
        table.classList.add("bg-white");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        const thead = document.createElement("thead");
        thead.style.borderBottom = "1px solid #dddddd";
        thead.style.zIndex = "100";
        thead.style.position = "sticky";
        thead.style.top = "0";
        thead.innerHTML = `<tr class="header-weeks">  
                                <th></th> <!-- Empty cell for spacing -->
                            </tr>`
                            + `<tr class="header-days">
                                <th></th> <!-- Empty cell for spacing -->
                                <!-- Days of the month will be populated dynamically -->
                            </tr>`;
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        container.appendChild(tableContainer);
    }
    


    displayScheduler(date, resources) {

        const scheduleTable = this.container.querySelector(".scheduleTable");
        const monthYearElement = this.container.querySelector(".monthYear");

        scheduleTable.querySelector("thead .header-weeks").innerHTML = "";
        scheduleTable.querySelector("thead .header-days").innerHTML = "";
        scheduleTable.querySelector("tbody").inneerHTML = "";

        const month = date.toLocaleString("default", {
            month: "long",
        });
        const year = date.getFullYear();
        monthYearElement.textContent = `${month} ${year}`;

        const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();

        const headerRow = scheduleTable.querySelector("thead .header-days");
        const nameRow = headerRow.insertCell();
        nameRow.innerHTML = `<th>${this.config.resourcesHeader}</th>`;
        nameRow.style.minWidth = "200px";
        nameRow.style.textAlign = "left";
        nameRow.style.fontSize = "15px";
        nameRow.style.textAlign = "center";
        nameRow.style.fontWeight = "bold";
        nameRow.style.border = "1px solid #ece9ff";
        nameRow.style.padding = "5px";

        for (let i = 1; i <= daysInMonth; i++) {
            const th = document.createElement("th");
            th.style.border = "1px solid #ece9ff";
            th.style.paddingBottom = "8px";
            th.style.paddingTop = "8px";
            th.style.textAlign = "center";
            th.style.fontSize = "14px";
            th.style.minWidth = "60px";
            th.textContent = i;

            // is weekend
            let fullDate = new Date(year, date.getMonth(), i);
            if (fullDate.getDay() == 0 || fullDate.getDay() == 6) {
                th.classList.add("is_weekend");
                th.style.backgroundColor = "#f7f7f7";
            }

            // detect today column
            const today = new Date();
            if (
                date.getDate() === i &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            ) {
                th.classList.add("is_today");
                th.style.backgroundColor = "#FFFAEB";
            }
            headerRow.appendChild(th);
        }

        // add resources
        resources.forEach((resource) => {
            const row = scheduleTable.querySelector("tbody").insertRow();
            const nameCell = row.insertCell();
            nameCell.classList.add("name");
            nameCell.style.paddingLeft = "8px";
            nameCell.innerHTML = resource.photo ? `<div style="display: flex; align-items: center;"><img src="${resource.photo}" class="avatar" width="38px" height="38px" style="border-radius: 50%; margin-right: 8px;"><p class="name-text">${resource.name}</p></div>` : `<p class="name-text">${resource.name}</p>`;
            // nameCell.innerHTML = `<p>${resource.name}</p>`;

            for (let day = 1; day <= daysInMonth; day++) {
                const td = row.insertCell();
                td.classList.add("day");

                td.setAttribute(
                    "data-day",
                    `${day}-${date.getMonth() + 1}-${date.getFullYear()}`
                );

                // is today
                const today = new Date();
                if (
                    date.getDate() === day &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                ) {
                    td.classList.add("is_today");
                    td.style.backgroundColor = "#FFFAEB";
                }

                // is weekend
                let fullDate = new Date(year, date.getMonth(), day);
                if (fullDate.getDay() == 0 || fullDate.getDay() == 6) {
                    td.classList.add("is_weekend");
                    td.style.backgroundColor = "#f7f7f7";
                }

                // add events
                const event = resource.events.find(
                    (a) =>
                        new Date(a.day).getDate() === day &&
                        new Date(a.day).getMonth() === date.getMonth() &&
                        new Date(a.day).getFullYear() === year
                );

                if (event) {
                    const eventElement = document.createElement("div");
                    eventElement.classList.add("event");
                    eventElement.style.position = "absolute";
                    eventElement.style.bottom = "0";
                    eventElement.style.left = "0";
                    eventElement.style.width = "75%";
                    eventElement.style.height = "40%";
                    eventElement.style.fontSize = "14px";
                    eventElement.style.textAlign = "center";
                    eventElement.style.padding = "5px";
                    eventElement.style.margin = "5px";
                    eventElement.style.borderRadius = "5px";
                    // eventElement.style.border = "1px solid #ece9ff";
                    eventElement.style.color = "#ffffff";
                    eventElement.style.backgroundColor = event.color ? event.color : "#000000";
                    eventElement.innerHTML = event.text ? `${event.text}` : "";
                    eventElement.style.overflow = "hidden";
                    eventElement.id = event.id;

                    eventElement.addEventListener("click", (e) => {
                        this.showEventInPlanner(event);
                    });
                    td.appendChild(eventElement);
                }

                td.addEventListener("mouseover", (e) => {
                    td.style.backgroundColor = "#ebebeb";

                    const ths = this.container.querySelectorAll("thead th");
                    ths.forEach((th) => {
                        if(th.textContent == day){
                            th.style.backgroundColor = "#ebebeb";
                        }
                    });

                    const tr = td.parentElement;
                    tr.querySelector(".name").style.backgroundColor = "#ebebeb";


                    // add tooltip
                    // const tooltip = document.createElement("div");
                    // tooltip.classList.add("tooltip");
                    // tooltip.style.position = "absolute";
                    // tooltip.style.zIndex = "100";
                    // tooltip.style.top = "0";
                    // tooltip.style.left = "0";
                    // tooltip.style.width = "100%";
                    // tooltip.style.height = "100%";
                    // tooltip.style.backgroundColor = "#000000";
                    // tooltip.style.color = "#ffffff";
                    // tooltip.style.padding = "10px";
                    // tooltip.style.borderRadius = "5px";
                    // tooltip.style.fontSize = "14px";
                    // tooltip.style.textAlign = "center";
                    // // tooltip.style.display = "none";
                    // tooltip.innerHTML = `<p>tete</p>`;
                    // td.appendChild(tooltip);
                });
    
                td.addEventListener("mouseout", (e) => {
                    td.style.backgroundColor = "#ffffff";

                    const ths = this.container.querySelectorAll("thead th");
                    ths.forEach((th) => {
                        if(th.textContent == day){
                            th.style.backgroundColor = "#ffffff";
                        }
                    });
    
                    const tr = td.parentElement;
                    tr.querySelector(".name").style.backgroundColor = "#ffffff";
                });

                             // add event to td to add event
             if (!td.querySelector(".event")) {
                td.addEventListener("mousedown", (obj) => {
                    // Set the start, end x, y coordinates
                    this.startCoords = {
                        x: obj.clientX,
                        y: obj.clientY,
                    };

                    this.endCoords = {
                        x: obj.clientX,
                        y: obj.clientY,
                    };

                    document.addEventListener(
                        "mousemove",
                        this.handleMouseMove,
                        false
                    );

                    this.currentResource = resource;
                });

                td.addEventListener("mouseup", (obj) => {
                    document.removeEventListener(
                        "mousemove",
                        this.handleMouseMove,
                        false
                    );

                    this.endCoords = {
                        x: obj.clientX,
                        y: obj.clientY,
                    };

                    let startElement = document.elementFromPoint(
                        this.startCoords.x,
                        this.startCoords.y
                    );

                    let endElement = document.elementFromPoint(
                        this.endCoords.x,
                        this.endCoords.y
                    );

                    // Check if the startElement and endElement are in the same row
                    if (
                        startElement.parentElement !== endElement.parentElement
                    ) {
                        // Get the index of the endElement in the parent row
                        const indexEndElement = Array.from(
                            endElement.parentElement.children
                        ).indexOf(endElement);

                        endElement =
                            startElement.parentElement.children[
                                indexEndElement
                            ];
                    }

                    const commonParent = startElement.parentElement;

                    // Check if the startElement is after the endElement in the DOM
                    const indexStartElement = Array.from(
                        commonParent.children
                    ).indexOf(startElement);
                    const indexEndElement = Array.from(
                        commonParent.children
                    ).indexOf(endElement);

                    if (indexStartElement > indexEndElement) {
                        [startElement, endElement] = [endElement, startElement];
                    }

                    const [startDay, startMonth, startYear] = startElement
                        .getAttribute("data-day")
                        .split("-");
                    const [endDay, endMonth, endYear] = endElement
                        .getAttribute("data-day")
                        .split("-");

                    const startDate = new Date(
                        startYear,
                        startMonth - 1,
                        startDay
                    );
                    const endDate = new Date(endYear, endMonth - 1, endDay);

                    this.addEventInPlanner(
                        new Date(startDate),
                        new Date(endDate),
                        this.currentResource
                    );
                });
            }
            }

            this.container.querySelectorAll("td").forEach((td) => {
                td.style.position = "relative";
                td.style.cursor = "pointer";
                td.style.border = "1px solid #ece9ff";
            });


            
        });

    }

    handleMouseMove = (e) => {
        this.endCoords = {
            x: e.clientX,
            y: e.clientY,
        };
    
        this.resetDragging();
    
        const elements = this.getElementsFromCoords(this.startCoords, this.endCoords);
    
        // Color the elements
        elements.forEach((element) => {
            element.style.setProperty("background-color", "#e0e0e0", "important");
    
            element.setAttribute("dragging", "true");
        });
    };

    resetDragging = () => {
        this.container.querySelectorAll("[dragging=true]").forEach((element) => {
            element.style.removeProperty("background-color");
            element.removeAttribute("dragging");
        });
    };

    getElementsFromCoords = (startCoords, endCoords) => {
        const startElement = document.elementFromPoint(
            startCoords.x,
            startCoords.y
        );
    
        const endElement = document.elementFromPoint(endCoords.x, endCoords.y);
    
        // Get all the elements between the start and end elements
        return this.getElemensBetween(startElement, endElement);
    };

    getElemensBetween = (startElement, endElement) => {

         // Find the common parent <tr> of startElement and endElement
    let commonParent = startElement.parentElement;

    // Initialize flag to track if we are between start and end
    let betweenElements = false;

    // Array to store elements between start and end
    let elementsBetween = [];

    if (startElement === endElement) {
        return [startElement];
    }

    // Check if the startElement and endElement are in the same row
    if (startElement.parentElement !== endElement.parentElement) {
        // Get the index of the endElement in the parent row
        const indexEndElement = Array.from(
            endElement.parentElement.children
        ).indexOf(endElement);

        endElement = commonParent.children[indexEndElement];
    }

    // Check if the startElement is after the endElement in the DOM
    const indexStartElement = Array.from(commonParent.children).indexOf(
        startElement
    );
    const indexEndElement = Array.from(commonParent.children).indexOf(
        endElement
    );

    if (indexStartElement > indexEndElement) {
        [startElement, endElement] = [endElement, startElement];
    }

    // Iterate through all <td> elements within the common parent <tr>
    for (let i = 0; i < commonParent.children.length; i++) {
        let currentElement = commonParent.children[i];

        // Check if the current element is startElement or endElement
        if (currentElement === startElement) {
            betweenElements = true;
            elementsBetween.push(currentElement);
            continue; // Skip adding startElement to elementsBetween
        } else if (currentElement === endElement) {
            betweenElements = false;
            elementsBetween.push(currentElement);
            break; // Stop adding elements after reaching endElement
        }

        // If between start and end, add currentElement to elementsBetween
        if (betweenElements) {
            elementsBetween.push(currentElement);
        }
    }

    return elementsBetween;
    }

    showEventInPlanner(event) {
        this.showEvent(event, this);
    }

    addEventInPlanner(startDate, endDate, resource) {
        this.addEvent(
            startDate,
            endDate,
            resource,
        );
    }
    

}
