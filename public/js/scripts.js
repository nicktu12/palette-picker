/* eslint-disable max-len, no-unused-vars, no-console, no-undef */

// IndexedDB

let db = new Dexie("palettePicker");

db.version(1).stores({
  projects: "id, name",
  palettes: "id, name, color1, color2, color3, color4, color5, projectId"
});

function saveProjectToIndexedDB(id, projectName) {
  return db.projects.add({ id, name: projectName });
}

function savePaletteToIndexedDB({
  name,
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  projectId
}) {
  return db.palettes.add({
    id: Date.now(),
    name,
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    projectId
  });
}

function loadOfflineProjects() {
  return db.projects.toArray();
}

function loadOfflinePalettes(id) {
  return db.palettes
    .where("projectId")
    .equals(id)
    .toArray();
}

// UI Functionality

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function assignRandomColors() {
  for (let i = 1; i <= 6; i++) {
    if (!$(`.color-${i}`).hasClass("lock")) {
      let color = getRandomColor();
      $(`.color-${i}-text`).text(color);
      $(`.color-${i}`).css("background-color", color);
    }
  }
}

function lockColor() {
  $(this).toggleClass("lock");
}

function saveProject() {
  const projectName = $(".save-project-input").val();
  const id = Date.now();
  saveProjectToIndexedDB(id, projectName)
    .then(project => {
      if (!navigator.onLine) {
        appendOfflineProject(project, projectName);
      }
    })
    .catch(error => {
      throw error;
    });
  return fetch("/api/v1/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: projectName })
  })
    .then(response => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then(response => {
      fetchProjects();
      return response.id;
    })
    .catch(error => {
      throw error;
    });
}

async function savePalette(event) {
  event.preventDefault();
  const name = $(".save-palette-input").val();
  const color1 = $(".color-1-text").text();
  const color2 = $(".color-2-text").text();
  const color3 = $(".color-3-text").text();
  const color4 = $(".color-4-text").text();
  const color5 = $(".color-5-text").text();
  const color6 = $(".color-6-text").text();
  const colorArray = [color1, color2, color3, color4, color5, color6];
  const projectInputValue = $(".save-project-input").val();
  const projectId =
    $(`#saved-projects option[value="${projectInputValue}"]`).data("value") ||
    (await saveProject());
  fetch("/api/v1/palettes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      color1,
      color2,
      color3,
      color4,
      color5,
      color6,
      projectId
    })
  })
    .then(response => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then(() => {
      fetchProjects();
    })
    .catch(error => {
      throw error;
    });
  addOfflinePalette(name, colorArray);
}

function addOfflinePalette(name, colorArray) {
  loadOfflineProjects()
    .then(projects =>
      projects.find(
        project =>
          project.name === $(".project-drop-down option:selected").text()
      )
    )
    .then(project => buildOfflinePalette(project.id, name, colorArray))
    .catch(error => {
      throw error;
    });
}

function buildOfflinePalette(projectId, name, colorArray) {
  const id = Date.now();
  const builtPalette = {
    id,
    name,
    color1: colorArray[0],
    color2: colorArray[1],
    color3: colorArray[2],
    color4: colorArray[3],
    color5: colorArray[4],
    color6: colorArray[5],
    projectId
  };
  savePaletteToIndexedDB(builtPalette)
    .then(palette => {
      if (!navigator.onLine) {
        appendPalettes([builtPalette], projectId);
      }
    })
    .catch(error => {
      throw error;
    });
}

function fetchPalettesToAppend(projectId) {
  fetch(`/api/v1/projects/${projectId}/palettes`)
    .then(response => response.json())
    .then(palettes => {
      appendPalettes(palettes, projectId);
    })
    .catch(error => {
      throw error;
    });
}

function fetchProjects() {
  $(".save-palette-input").val("");
  $(".project-drop-down").html("");
  $(".append-projects").html("");
  fetch("/api/v1/projects")
    .then(response => response.json())
    .then(projects => {
      $("#saved-projects").html("");
      projects.forEach(project => {
        appendProject(project);
        fetchPalettesToAppend(project.id);
      });
      $(".saved-project").on("click", accordionDisplay);
    })
    .catch(error => {
      loadOfflineProjects()
        .then(projects => {
          projects.forEach(project => {
            appendOfflineProject(project.id, project.name);
            loadOfflinePalettes(project.id)
              .then(palettes => {
                appendPalettes(palettes, project.id);
              })
              .catch(error => {
                throw error;
              });
          });
        })
        .catch(error => {
          throw error;
        });
    });
}

function appendProject(fetchedProject) {
  const projectName = `<option data-value=${fetchedProject.id} value="${
    fetchedProject.name
  }"></option>`;
  const project = `
    <article class="saved-project">
      <h3>${fetchedProject.name}</h3>
      <div class="append-palette-${fetchedProject.id} small-palettes"></div>
    </article>
  `;
  $(".append-projects").append(project);
  $(".small-palettes").hide();
  $("#saved-projects").append(projectName);
}

function appendOfflineProject(id, name) {
  const projectName = `<option data-value=${fetchedProject.id} value="${
    fetchedProject.name
  }"></option>`;
  const project = `
    <article class="saved-project">
      <h3>${name}</h3>
      <div class="append-palette-${id} small-palettes"></div>
    </article>
  `;
  $(".projects").append(project);
  $(".project-drop-down").append(projectName);
}

function appendPalettes(palettesArray, projectId) {
  palettesArray.forEach(palette => {
    const paletteName = palette.name;
    const projectPalettes = `
      <section id="${palette.id}" class='saved-palette-${
      palette.id
    }' data-colors='${JSON.stringify([
      palette.color1,
      palette.color2,
      palette.color3,
      palette.color4,
      palette.color5,
      palette.color6
    ])}'>
      <p class="palette-name">${paletteName}</p>
      <ul class="circle">
      <li>
        <div style='background-color: ${
          palette.color6
        }' class='small-palette'></div>
      </li>
      <li>
        <div style='background-color: ${
          palette.color1
        }' class='small-palette'></div>
      </li>
      <li>
        <div style='background-color: ${
          palette.color2
        }' class='small-palette'></div>
      </li>
      <li>
        <div style='background-color: ${
          palette.color3
        }' class='small-palette'></div>
      </li>
      <li>
        <div style='background-color: ${
          palette.color4
        }' class='small-palette'></div>
      </li>
      <li>
        <div style='background-color: ${
          palette.color5
        }' class='small-palette'></div>
      </li>
      </ul>
      <button class="delete-palette-${palette.id}">Delete</button>
    </section>
    `;
    $(`.append-palette-${projectId}`).append(projectPalettes);
    $(`.delete-palette-${palette.id}`).on("click", deletePalette);
  });
}

function deletePalette() {
  const id = $(this)
    .parent()
    .prop("id");
  console.log($(this), id);
  fetch(`/api/v1/palettes/${id}`, {
    method: "DELETE"
  })
    .then(() => $(`#${id}`).remove())
    .catch(error => {
      throw error;
    });
}

function displayPalette() {
  const palette = $(event.target).closest("section");
  const colors = JSON.parse(palette.attr("data-colors"));

  colors.forEach((color, index) => {
    $(`.color-${index + 1}`).css("background-color", color);
  });
}

// Service Worker registration

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../service-worker.js")
      .then(registration => navigator.serviceWorker.ready)
      .then(registration => {
        Notification.requestPermission();
        console.log("ServiceWorker registration successful");
      })
      .catch(error => {
        console.log(`ServiceWorker registration failed: ${error}`);
      });
  });
}

function accordionDisplay() {
  const target = $(this).children(".small-palettes");
  const allPanels = $(".small-palettes");
  if (!target.hasClass("active")) {
    allPanels.removeClass("active").slideUp();
    target.addClass("active").slideDown();
  }
}

// Aperture effect

const apertureEffect = () => {
  $(".camera-shutter--animation1").toggleClass(
    "camera-shutter--open camera-shutter--f32"
  );
};

$(".new-colors").click(function() {
  apertureEffect();
  setTimeout(assignRandomColors, 500);
  setTimeout(apertureEffect, 500);
});

// Page load and event listeners

$(document).ready(() => {
  assignRandomColors();
  fetchProjects();
});

$(".lock-button").on("click", lockColor);
$(".save-palette").on("submit", savePalette);
$(".projects").on("click", "section", displayPalette);
