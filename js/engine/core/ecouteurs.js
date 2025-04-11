function initListeners(inputStates, canvas) {
    window.onkeydown = (event) => {
        console.log("Touche pressée : " + event.key);
        if(event.key === "ArrowRight") {
            inputStates.ArrowRight = true;
        }
        if(event.key === "ArrowLeft") {
            inputStates.ArrowLeft = true;
        }
        if(event.key === "ArrowUp") {
            inputStates.ArrowUp = true;
        }
        if(event.key === "ArrowDown") {
            inputStates.ArrowDown = true;
        }
        if(event.code === "Space") {
            inputStates.Space = true;
        }
        
        // Touches de tir
        if(event.key === "z" || event.key === "Z") inputStates.KeyZ = true;
        if(event.key === "q" || event.key === "Q") inputStates.KeyQ = true;
        if(event.key === "s" || event.key === "S") inputStates.KeyS = true;
        if(event.key === "d" || event.key === "D") inputStates.KeyD = true;
    }

    window.onkeyup = (event) => {
        console.log("Touche relachée : " + event.key);
        if(event.key === "ArrowRight") {
            inputStates.ArrowRight = false;
        }
        if(event.key === "ArrowLeft") {
            inputStates.ArrowLeft = false;
        }
        if(event.key === "ArrowUp") {
            inputStates.ArrowUp = false;
        }
        if(event.key === "ArrowDown") {
            inputStates.ArrowDown = false;
        }
        if(event.code === "Space") {
            inputStates.Space = false;
        }
        
        // Touches de tir
        if(event.key === "z" || event.key === "Z") inputStates.KeyZ = false;
        if(event.key === "q" || event.key === "Q") inputStates.KeyQ = false;
        if(event.key === "s" || event.key === "S") inputStates.KeyS = false;
        if(event.key === "d" || event.key === "D") inputStates.KeyD = false;
    }

    window.onmousemove = (event) => {
        // get proper x and y for the mouse in the canvas
        inputStates.mouseX = event.clientX - canvas.getBoundingClientRect().left;
        inputStates.mouseY = event.clientY - canvas.getBoundingClientRect().top;
    }
}

export { initListeners };