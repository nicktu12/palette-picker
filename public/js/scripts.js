function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
    console.log(color);
    return color;
}

function assignRandomColors() {
  console.log($('.color-1'))
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
  .catch(error => console.log({ error }))
  $('.save-palette-input').val('');
}

const projectsList = () => {
  return fetch('/api/v1/projects', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify()
  })
}

const listitems = '';
//$.each(temp, function(key, value){
  //      listitems += '<option value=' + key + '>' + value + '</option>';
  //});
// $select.append(listitems);

$(document).ready(() => {
    assignRandomColors();
});

$('.new-colors').on('click', assignRandomColors);
$('.lock-button').on('click', lockColor);
$('.save-project').on('submit', saveProject);
