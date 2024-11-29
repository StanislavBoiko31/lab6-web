const API_URL = "http://127.0.0.1:8000";

let openCollapses = [];

function createCollapsesContainer(container) {
    container.innerHTML = `
        <h2>Collapse Objects</h2>
        <div id="collapses-container">
        
        </div>
    `;

    async function renderCollapses() {
        try {
            const { collapses } = await getCollapses();
            const collapsesContainer = document.getElementById("collapses-container");
            collapsesContainer.innerHTML = collapses
                .map(
                    (collapse, index) => `
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading${index}">
                                <button class="accordion-button" type="button" onclick="toggleCollapse(${index})">
                                    ${collapse.title}
                                </button>
                            </h2>
                            <div id="collapse${index}" class="accordion-collapse" style="display: ${openCollapses[index] ? "block" : "none"};">
                                <div class="accordion-body">
                                    ${collapse.content}
                                </div>
                            </div>
                        </div>
                    `
                )
                .join("");
        } catch (error) {
            console.error("Failed to load collapses:", error);
        }
    }

    async function getCollapses() {
        const response = await fetch(`${API_URL}/get-collapses`);
        return response.json();
    }

    window.toggleCollapse = (index) => {

        openCollapses[index] = !openCollapses[index];
        const collapseElement = document.getElementById(`collapse${index}`);
        if (openCollapses[index]) {
            collapseElement.style.display = "block";
        } else {
            collapseElement.style.display = "none";
        }
    };

    renderCollapses();
    setInterval(renderCollapses, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    const gridItem3 = document.querySelector(".grid-item_3");
    if (gridItem3) {
        createCollapsesContainer(gridItem3);
    }
});
