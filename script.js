const GITHUB_USERNAME = "CompanyBuild";
const GITHUB_REPOSITORY = "CalderaFraming.com";
const PROJECT_FOLDER = "images/projects";


// =========================
// PAGE NAVIGATION
// =========================

function showPage(pageName, button) {

    // Hide all pages
    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });


    // Show selected page
    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    // Remove active state from navigation buttons
    const buttons = document.querySelectorAll(".nav-button");

    buttons.forEach(function(navButton) {
        navButton.classList.remove("active");
    });


    // Activate selected button
    if (button) {
        button.classList.add("active");
    }


    // Scroll to the top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =========================
// AUTOMATIC PROJECT LOADER
// =========================

async function loadProjects() {

    const projectsGrid = document.getElementById("projects-grid");

    if (!projectsGrid) {
        return;
    }


    try {

        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/${PROJECT_FOLDER}`
        );


        if (!response.ok) {
            throw new Error("Could not load projects.");
        }


        const files = await response.json();


        // Clear existing projects
        projectsGrid.innerHTML = "";


        files.forEach(function(file) {

            // Only allow image files
            if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return;
            }


            // Create project card
            const projectCard = document.createElement("div");

            projectCard.className = "project-card";


            // Create image
            const image = document.createElement("img");

            image.src = file.download_url;

            image.alt = getProjectName(file.name);


            // Create information container
            const projectInfo = document.createElement("div");

            projectInfo.className = "project-info";


            // Create title
            const title = document.createElement("h3");

            title.textContent = getProjectName(file.name);


            // Create description
            const description = document.createElement("p");

            description.textContent = "Previous project.";


            // Assemble card
            projectInfo.appendChild(title);

            projectInfo.appendChild(description);

            projectCard.appendChild(image);

            projectCard.appendChild(projectInfo);

            projectsGrid.appendChild(projectCard);

        });


        // Show message if there are no projects
        if (projectsGrid.children.length === 0) {

            projectsGrid.innerHTML = `
                <p>
                    No projects have been added yet.
                </p>
            `;

        }


    } catch (error) {

        console.error(error);

        projectsGrid.innerHTML = `
            <p>
                Unable to load projects.
            </p>
        `;

    }
}


// =========================
// PROJECT NAME FORMATTER
// =========================

function getProjectName(filename) {

    return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, function(letter) {
            return letter.toUpperCase();
        });

}


// =========================
// COPYRIGHT YEAR
// =========================

const yearElement = document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


// =========================
// LOAD PROJECTS
// =========================

loadProjects();
