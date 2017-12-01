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
  console.log('heyyyyy:w')
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
  const name = $('.save-palette-input').val();
  const color1 = $('.color-1-text').text();
  const color2 = $('.color-2-text').text();
  const color3 = $('.color-3-text').text();
  const color4 = $('.color-4-text').text();
  const color5 = $('.color-5-text').text();
  const projectId = $('.project-drop-down').val();

  fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, color1, color2, color3, color4, color5, projectId })
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
    .catch(error => console.log({ error }));
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
      <section class='${palette.id}' data-colors='${JSON.stringify([palette.color1, palette.color2, palette.color3, palette.color4, palette.color5])}'>
        <p>${paletteName}</p>
        <div style='background-color: ${palette.color1}' class='palette-color-1'>d</div>
        <div style='background-color: ${palette.color2}' class='palette-color-2'>d</div>
        <div style='background-color: ${palette.color3}' class='palette-color-3'>d</div>
        <div style='background-color: ${palette.color4}' class='palette-color-4'>d</div>
        <div style='background-color: ${palette.color5}' class='palette-color-5'>d</div>
        <button>Delete</button>
      </section>
    `;
  $(`.append-palette-${projectId}`).append(projectPalettes);
  })
}

function deletePalette(){
  console.log($(this).parent().prop('className'))
  const id = $(this).parent().prop('className');

  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
  .then(()=>$(`.${id}`).remove())
  .catch(error => console.log({ error }));
}

function displayPalette(){
  const palette = $(event.target).closest('section');
  const colors = JSON.parse(palette.attr('data-colors'))

  colors.forEach((color, index)=>{
    $(`.color-${index + 1}`).css('background-color', color)
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
$('.projects').on('click', 'button', deletePalette);
$('.projects').on('click', 'section', displayPalette);
