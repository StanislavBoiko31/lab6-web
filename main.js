const API_URL = "http://13.60.166.45:8000";

function createForm(container) {
    container.innerHTML = `
        <h2>Create Collapses</h2>
        <form id="collapse-form">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required>
            <label for="content">Content:</label>
            <textarea id="content" name="content" required></textarea>
            <div>
                <button type="submit">Add Collapse</button>
            </div>
        </form>
    `;

    const form = document.getElementById("collapse-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        const collapses = await getCollapses();
        collapses.collapses.push({ title, content });

        await saveCollapses(collapses.collapses);
        alert("Collapse added!");
        form.reset();
    });
}

async function saveCollapses(collapses) {
    await fetch(`${API_URL}/save-collapses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collapses }),
    });
}

async function getCollapses() {
    const response = await fetch(`${API_URL}/get-collapses`);
    return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
    const gridItem3 = document.querySelector(".grid-item_3");
    if (gridItem3) {
        createForm(gridItem3);
    }
});
