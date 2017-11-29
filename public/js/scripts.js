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
  console.log('asdf')
  fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'test' })
  })
  .then(response => {
    if (response.status === 201) {
      return response.json()
    }
  })
}

$(document).ready(() => {
    assignRandomColors();
});

$('.new-colors').on('click', assignRandomColors);
$('.lock-button').on('click', lockColor);
$('.save-project').on('submit', saveProject);
