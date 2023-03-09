const canvas = document.querySelector('canvas');
//using c instead of context because this will be repeated a lot
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 
            0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
};

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius 
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 
            0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
};

const x = canvas.width / 2;
const y = canvas.height / 2;


const player = new Player(x, y, 30, 'blue');
player.draw();

function animate() {
    requestAnimationFrame(animate)
    console.log('go')
}

addEventListener('click', (event) => {
    console.log(event);
    const projectile = new Projectile(
        canvas.width / 2, 
        canvas.height / 2, 
        5, 
        'red', 
        null
    )

    projectile.draw()
});

animate();