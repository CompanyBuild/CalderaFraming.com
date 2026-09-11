const GITHUB_USERNAME = "CompanyBuild";
const GITHUB_REPOSITORY = "calderaframing.com";
const PROJECT_FOLDER = "images/projects";


// =========================
// PAGE NAVIGATION
// =========================

function showPage(pageName, button) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });


    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    const buttons = document.querySelectorAll(".nav-button");

    buttons.forEach(function(navButton) {
        navButton.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =========================
// PROJECT NAME FORMATTER
// =========================

function getProjectName(filename) {

    return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/\d+$/, "")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, function(letter) {
            return letter.toUpperCase();
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


        if (!Array.isArray(files)) {
            throw new Error("GitHub did not return a folder.");
        }


        projectsGrid.innerHTML = "";


        for (const file of files) {

            if (file.type !== "dir") {
                continue;
            }


            const infoResponse = await fetch(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/${PROJECT_FOLDER}/${encodeURIComponent(file.name)}/info.json`
            );


            if (!infoResponse.ok) {
                console.warn(`No info.json found for ${file.name}.`);
                continue;
            }


            const infoFile = await infoResponse.json();


            const infoResponseData = await fetch(infoFile.download_url);


            if (!infoResponseData.ok) {
                console.warn(`Could not read info.json for ${file.name}.`);
                continue;
            }


            const info = await infoResponseData.json();


            if (!info.image) {
                console.warn(`No image specified in ${file.name}/info.json.`);
                continue;
            }


            // Create project card

            const projectCard = document.createElement("div");

            projectCard.className = "project-card";


            // Create image

            const image = document.createElement("img");

            image.src =
                `${PROJECT_FOLDER}/${encodeURIComponent(file.name)}/${encodeURIComponent(info.image)}`;

            image.alt =
                info.title || getProjectName(file.name);

            image.style.cursor = "pointer";


            // Open full image when clicked

            image.onclick = function() {

                window.open(
                    image.src,
                    "_blank"
                );

            };


            // Create information container

            const projectInfo = document.createElement("div");

            projectInfo.className = "project-info";


            // Create title

            const title = document.createElement("h3");

            title.textContent =
                info.title || getProjectName(file.name);


            // Create description

            const description = document.createElement("p");

            description.innerHTML  = info.description || "No desc";

            // Assemble card

            projectInfo.appendChild(title);

            projectInfo.appendChild(description);

            projectCard.appendChild(image);

            projectCard.appendChild(projectInfo);

            projectsGrid.appendChild(projectCard);

        }


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
