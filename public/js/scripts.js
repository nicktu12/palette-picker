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
    let color = getRandomColor();
    $(`.color-${i}`).text(color);
    $(`.color-${i}`).css('background-color', color)
  }
}

$(document).ready(() => {
    assignRandomColors();
});

$('.new-colors').on('click', assignRandomColors);
