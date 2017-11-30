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
      $(`.color-${i}`).css('background-color', color)
    }
  }
}

function lockColor() {
  $(this).parent().toggleClass('lock');
}

function saveProject(event) {
  event.preventDefault();
  const projectName = $('.save-palette-input').val()
  fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: projectName })
  })
  .then(response => {
    if (response.status === 201) {
      return response.json()
    }
  })
  .then(()=>{
    $('.save-palette-input').val('')
    $('.projects').html('');
    $('.project-drop-down').html('');
    fetchProjects();
  })
  .catch(error => console.log({ error }))
}

function fetchProjects() {
  fetch('/api/v1/projects')
    .then(response=> response.json())
    .then(projects=>{
      projects.forEach(project=>{
        appendToDom(project);
      })
    })
}

function appendToDom(fetchResult) {
  const projectName = `<option value=${fetchResult.id}>${fetchResult.name}</option>`;
  const project = `
    <article>
      <h3>${fetchResult.name}</h3>
    </article>
  `;
  $('.projects').append(project)
  $('.project-drop-down').append(projectName)
}

$(document).ready(() => {
  assignRandomColors();
  fetchProjects();
});

$('.new-colors').on('click', assignRandomColors);
$('.lock-button').on('click', lockColor);
$('.save-project').on('submit', saveProject);
