

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1900;
canvas.height = 960;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70){
    collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
    static width    = 48; //48 = nombre de tilles de la map
    static height   = 48;
    constructor({position}){
        this.position   = position
        this.width      = 48 
        this.height     = 48
    }
    draw(){
        context.fillStyle = "rgba(255,0,0,0)";
        context.fillRect(this.position.x, this.position.y, this.width, this.height); 
    }
}
 
const boundaries = [];
const offset = {
    x: -1250,
    y: -440
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => { 
        if (symbol === 1025){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y 
                    }
                })
            )
        }
    })
})

const image         = new Image();
image.src           = "img/Jeu-MAP.png";

const playerImage   = new Image();
playerImage.src     = "img/playerDown.png";

class Sprite {
    constructor({position, velocity, image, frames = {max : 1}}) {
        this.position = position
        this.image = image
        this.frames = frames
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
    }
    draw(){
        context.drawImage(
            this.image,
            0, // 4 arguments pour cropper le sprite
            0,
            this.image.width / this.frames.max,  // "cropper" le background par le "maximum"
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height,
        );
    }
}

// (canvas.height / 2)  - (this.image.height / 2),

// PERSONNAGE
const player = new Sprite({
    position: {
        x: (canvas.width / 2) - (192 / 4) / 2,   //192 x 68 = taille du sprite
        y: (canvas.height / 2)  - (68 / 2)
    },
    image : playerImage,
    frames : {
        max: 4 // 4 permet de cropper le sprite
    }
})

// MAP
const background = new Sprite({
    position : {
        x: offset.x,
        y: offset.y
    },
    image : image,
})

const keys = {
    ArrowDown: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
}


// éléments à dissocier du personnage
const mobiles = [background, ...boundaries];

function rectCollision({rectangle1, rectangle2}){
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )

}

function animate(){ 
    window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach(boundary => {
        boundary.draw();
        
    })
    player.draw(); 
    let moving = true;
    if (keys.ArrowDown.pressed && lastkey === "ArrowDown")
        {for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{ // cloner l'objet boundary sans l'écraser 
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }},
                    })
                ){
                console.log("colliding");
                moving = false;
                break;
                
            } 
        }
        if(moving)
        mobiles.forEach(mobiles => {
        mobiles.position.y -= 3;
        })

    } else if (keys.ArrowUp.pressed && lastkey === "ArrowUp"){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{ // cloner l'objet boundary sans l'écraser 
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }},
                })
            ){
                console.log("colliding");
                moving = false;
                break;
                     
            } 
        }
        if(moving)
        mobiles.forEach(mobiles => {
        mobiles.position.y += 3;
        })

    } else if (keys.ArrowLeft.pressed && lastkey === "ArrowLeft") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{ // cloner l'objet boundary sans l'écraser 
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }},
                })
            ){
                console.log("colliding");
                moving = false;
                break;
                     
            } 
        }
        if(moving)
        mobiles.forEach(mobiles => {
        mobiles.position.x += 3;
        })

    } else if (keys.ArrowRight.pressed && lastkey === "ArrowRight") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{ // cloner l'objet boundary sans l'écraser 
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }},
                })
            ){
                console.log("colliding");
                moving = false;
                break;
                     
            } 
        }
        if(moving)
        mobiles.forEach(mobiles => {
        mobiles.position.x -= 3;
        })
    }
    
}
animate();


let lastkey = "";

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowDown" :
            keys.ArrowDown.pressed  = true;
            lastkey                 = "ArrowDown";
            break;
        case "ArrowUp" :
            keys.ArrowUp.pressed    = true;
            lastkey                 = "ArrowUp";
            break;
        case "ArrowLeft" :
            keys.ArrowLeft.pressed  = true;
            lastkey                 = "ArrowLeft";
            break;  
        case "ArrowRight" :
            keys.ArrowRight.pressed = true;
            lastkey                 = "ArrowRight";
            break;

    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowDown" :
            keys.ArrowDown.pressed  = false;
            break;
        case "ArrowUp" :
            keys.ArrowUp.pressed    = false;
            break;
        case "ArrowLeft" :
            keys.ArrowLeft.pressed  = false;
            break;  
        case "ArrowRight" :
            keys.ArrowRight.pressed = false;
            break;

    }
});
