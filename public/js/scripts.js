/* eslint-disable max-len, no-unused-vars, no-console, no-undef */

// IndexedDB

let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, name',
  palettes: 'id, name, color1, color2, color3, color4, color5, projectName',
});

function saveProjectToIndexedDB(name) {
  return db.projects.add({id: Date.now(), name});
}

function savePaletteToIndexedDB({ 
  name, color1, color2, color3, color4, color5, projectName,
}) {
  return db.palettes.add({
    id: Date.now(),
    name, color1, color2, color3, color4, color5, projectName,
  });
}

function loadOfflinePalettes() {
  return db.palettes.toArray();
}

function loadOfflineProjects() {
  return db.projects.toArray();
}

// UI Functionality

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function assignRandomColors() {
  for (let i = 1; i < 6; i++) {
    if (!$(`.color-${i}`).hasClass('lock')){
      let color = getRandomColor();
      $(`.color-${i}-text`).text(color);
      $(`.color-${i}`).css('background-color', color);
    }
  }
}

function lockColor() {
  $(this).parent().toggleClass('lock');
}

function saveProject(event) {
  event.preventDefault();
  const projectName = $('.save-project-input').val();
  saveProjectToIndexedDB(projectName)
    .then(project => appendProjects(project))
    .catch(error => console.log(error));
  fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: projectName })
  })
    .then(response => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then(()=>{
      $('.save-project-input').val('');
      $('.projects').html('');
      $('.project-drop-down').html('');
      fetchProjects();
    })
    .catch(error => alert({ error }));
}

function savePalette(event) {
  event.preventDefault();
  const name = $('.save-palette-input').val();
  const color1 = $('.color-1-text').text();
  const color2 = $('.color-2-text').text();
  const color3 = $('.color-3-text').text();
  const color4 = $('.color-4-text').text();
  const color5 = $('.color-5-text').text();
  const projectId = $('.project-drop-down').val();
  savePaletteToIndexedDB({
    name, color1, color2, color3, color4, color5, projectName: name,
  });
  fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      { name, color1, color2, color3, color4, color5, projectId }
    )
  })
    .then(response => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then(()=>{
      $('.save-palette-input').val('');
      $('.project-drop-down').html('');
      $('.projects').html('');
      fetchProjects();
    })
    .catch(error => alert({ error }));
}

function fetchProjects() {
  fetch('/api/v1/projects')
    .then(response=> response.json())
    .then(projects=>{
      projects.forEach(project=>{
        appendProjects(project);
        fetch(`/api/v1/projects/${project.id}/palettes`)
          .then(response=>response.json())
          .then(palettes=>appendPalettes(palettes, project.id));
      });
    })
    .catch(error => {
      loadOfflineProjects()
        .then(projects => projects.forEach(project => {
          appendProjects(project);
          loadOfflinePalettes()
            .then(palettes => {
              console.log(palettes, project);
              const matchingPalettes = palettes.filter(palette => palette.projectName === project.name);
              appendPalettes(matchingPalettes, project.id);
            })
            .catch(error => { throw error; });
        }))
        .catch(error => { throw error; });
    });
}

function appendProjects(fetchedProject) {
  const projectName =
    `<option value=${fetchedProject.id}>${fetchedProject.name}</option>`;
  const project = `
    <article>
      <h3>${fetchedProject.name}</h3>
      <div class="append-palette-${fetchedProject.id}"></div>
    </article>
  `;
  $('.projects').append(project);
  $('.project-drop-down').append(projectName);
}

function appendPalettes(palettesArray, projectId) {
  palettesArray.forEach(palette=>{
    const paletteName = palette.name;
    const projectPalettes = `
      <section class='${palette.id}' data-colors='${JSON.stringify([palette.color1, palette.color2, palette.color3, palette.color4, palette.color5])}'>
        <p class="palette-name">${paletteName}</p>
        <button class="delete-palette">Delete</button>
        <div class="small-palettes-div">
        <div style='background-color: ${palette.color1}' class='palette-color-1 small-palette'></div>
        <div style='background-color: ${palette.color2}' class='palette-color-2 small-palette'></div>
        <div style='background-color: ${palette.color3}' class='palette-color-3 small-palette'></div>
        <div style='background-color: ${palette.color4}' class='palette-color-4 small-palette'></div>
        <div style='background-color: ${palette.color5}' class='palette-color-5 small-palette'></div>
        </div>
      </section>
    `;
    $(`.append-palette-${projectId}`).append(projectPalettes);
  });
}

function deletePalette(){
  const id = $(this).parent().prop('className');

  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
    .then(()=>$(`.${id}`).remove())
    .catch(error => alert({ error }));
}

function displayPalette(){
  const palette = $(event.target).closest('section');
  const colors = JSON.parse(palette.attr('data-colors'));

  colors.forEach((color, index)=>{
    $(`.color-${index + 1}`).css('background-color', color);
  });
}

// Service Worker registration

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../service-worker.js')
      .then(registration => navigator.serviceWorker.ready)
      .then(registration => {
        Notification.requestPermission();
        console.log('ServiceWorker registration successful');
      }).catch(error => {
        console.log(`ServiceWorker registration failed: ${error}`);
      });
  });
}

// Page load and event listeners

$(document).ready(() => {
  assignRandomColors();
  fetchProjects();
});

$('.new-colors').on('click', assignRandomColors);
$('.lock-button').on('click', lockColor);
$('.save-project').on('submit', saveProject);
$('.save-palette').on('submit', savePalette);
$('.projects').on('click', 'button', deletePalette);
$('.projects').on('click', 'section', displayPalette);
