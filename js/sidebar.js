const resizeData = {
    tracking: false,
    startCursorScreenX: null,
    maxWidth: 800,
    minWidth: 200
};

document.getElementById('resize-handle').addEventListener('mousedown', event => {
    event.preventDefault();
    event.stopPropagation();
    resizeData.startWidth = document.getElementById('accordionSidebar').offsetWidth;
    resizeData.startCursorScreenX = event.screenX;
    resizeData.tracking = true;
});

document.addEventListener('mousemove', event => {
    if (resizeData.tracking) {
        const cursorScreenXDelta = event.screenX - resizeData.startCursorScreenX;
        let newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
        newWidth = Math.max(resizeData.minWidth, newWidth);
        document.getElementById('accordionSidebar').style.width = newWidth + 'px';
    }
})

document.addEventListener('mouseup', event => {
    if(resizeData.tracking) resizeData.tracking = false
});