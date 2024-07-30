let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener("touchmove", function(event) {
    if (event.touches.length > 1) return;

    const touch = event.touches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal movement
        if (deltaX > 0 && dx === 0) {
            // Swipe right
            dx = 1;
            dy = 0;
        } else if (deltaX < 0 && dx === 0) {
            // Swipe left
            dx = -1;
            dy = 0;
        }
    } else {
        // Vertical movement
        if (deltaY > 0 && dy === 0) {
            // Swipe down
            dx = 0;
            dy = 1;
        } else if (deltaY < 0 && dy === 0) {
            // Swipe up
            dx = 0;
            dy = -1;
        }
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
});
