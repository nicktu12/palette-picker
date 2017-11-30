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
    .catch(error => console.log({ error }));
}

function savePalette(event) {
  event.preventDefault();
  const paletteName = $('.save-palette-input').val();
  console.log(paletteName)
}

function fetchProjects() {
  fetch('/api/v1/projects')
    .then(response=> response.json())
    .then(projects=>{
      projects.forEach(project=>{
        appendProjects(project);
        fetch(`/api/v1/projects/${project.id}/palettes`)
          .then(response=>response.json())
          .then(palettes=>appendPalettes(palettes, project.id))
      });
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
      <div>
        <p>${paletteName}</p>
        <div style='background-color: ${palette.color1}'>d</div>
        <div style='background-color: ${palette.color2}'>d</div>
        <div style='background-color: ${palette.color3}'>d</div>
        <div style='background-color: ${palette.color4}'>d</div>
        <div style='background-color: ${palette.color5}'>d</div>
      </div>
    `;
  $(`.append-palette-${projectId}`).append(projectPalettes);
  })
}

$(document).ready(() => {
  assignRandomColors();
  fetchProjects();
});

$('.new-colors').on('click', assignRandomColors);
$('.lock-button').on('click', lockColor);
$('.save-project').on('submit', saveProject);
$('.save-palette').on('submit', savePalette);
