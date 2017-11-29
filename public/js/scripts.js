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

$(document).ready(() => {
    assignRandomColors();
});

$('.new-colors').on('click', assignRandomColors);
$('.lock-button').on('click', lockColor);
