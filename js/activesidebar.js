document.addEventListener('DOMContentLoaded', function() {
    var activedItem = document.querySelectorAll('.item')[0];
    activedItem.classList.add('active');
});

function activeItem(event) {
    var items = document.querySelectorAll('.nav-item');

    items.forEach(function(item) {
    item.classList.remove('active');
});

    var activeTarget = event.target;
    activeTarget.classList.add('active');
}