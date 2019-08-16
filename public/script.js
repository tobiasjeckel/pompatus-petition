// When true, moving the mouse draws on the canvas
var isDrawing = false;
var x = 0;
var y = 0;

const sig = document.getElementById("sig");
const sigData = document.getElementById("sigData");
const context = sig.getContext("2d");

// Add the event listeners for mousedown, mousemove, and mouseup
sig.addEventListener("mousedown", e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});

sig.addEventListener("mousemove", e => {
    if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});

sig.addEventListener("mouseup", e => {
    if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
        sigData.value = sig.toDataURL();
    }
});

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}
