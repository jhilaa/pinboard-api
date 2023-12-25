const ellipseContainer = document.getElementById('ellipse-container');
const hoverButton = document.getElementById('hover-button');

hoverButton.addEventListener('mouseenter', function() {
    ellipseContainer.classList.add('active');
});

hoverButton.addEventListener('mouseleave', function() {
    ellipseContainer.classList.remove('active');
});

const circles = document.querySelectorAll('.circle');

circles.forEach(circle => {
    circle.addEventListener('click', function() {
        ellipseContainer.classList.remove('active');
    });
});

document.addEventListener('click', function(event) {
    if (!ellipseContainer.contains(event.target) && event.target !== hoverButton) {
        ellipseContainer.classList.remove('active');
    }
});
