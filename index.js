/*ASAteroids is a modified version of Base Defense Game from 
Chris' Courses, which can be found here: 
https://chriscourses.com/courses/javascript-games/videos/project-setup 

TODOs:

1) Add upgrade items / upgrade particle physics
    (upgrade items / hit det added, just need to add
    upgrade player / particle physics)
2) Add leaderboard to track high scores
3) Add boss fights*/

const canvas = document.querySelector('canvas');
//using "c" instead of "context" because this will be repeated a lot
const c = canvas.getContext('2d');
//enemy icons directory and array
const enemyDir = "./enemies/";
const enemyFiles = [
    "icon-ada.svg",
    "icon-atom.svg",
    "icon-bnb.svg",
    "icon-btc.svg",
    "icon-doge.svg",
    "icon-eth.svg",
    "icon-ltc.svg",
    "icon-shib.svg",
    "icon-sol.svg",
    "icon-trx.svg",
    "icon-usdt.svg",
    "icon-xmr.svg"
];
const enemySprite = enemyFiles.map(file => enemyDir + file);
console.log(enemySprite);
//upgrade icons directory and array
const upgradeDir = "./upgrades/";
const upgradeFiles = [
    "icon-afd.svg",
    "icon-algo.svg",
    "icon-dc.svg",
    "icon-grad.svg",
    "icon-ogs.svg",
    "icon-puddin.svg",
    "icon-trts.svg"
];
const upgradeSprite = upgradeFiles.map(file => upgradeDir + file);
console.log(upgradeSprite);

const scoreEl = document.querySelector('#scoreEl');
const modal = document.querySelector('#modal');
const modalScore = document.querySelector('#modalScore');
const button = document.querySelector('#button');
const startButton = document.querySelector('#startButton');
const startModal = document.querySelector('#startModal');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, playerImage) {
        this.x = x
        this.y = y
        this.radius = radius
        this.image = document.querySelector('#playerImage')
    }
    draw() {
            c.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
    }
};

class Projectile {
    constructor(x, y, radius, color, velocity, scatterShot) {
        this.x = x
        this.y = y
        this.radius = radius 
        this.color = color
        this.velocity = velocity
        this.scatterShot = false;
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 
            0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y

        if (this.hasUpgrade) {
            this.scatterShot = true;
            console.log("scattershot:", this.scatterShot)
        }        
    }
};

class Enemy {
    constructor(x, y, radius, color, velocity, enemyImage) {
        this.x = x
        this.y = y
        this.radius = radius 
        this.color = color
        this.velocity = velocity
        this.enemyImage = enemyImage;
    }
    draw() {
        c.drawImage(
            this.enemyImage,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        )
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
};

class Upgrade {
    constructor(x, y, radius, color, velocity, upgradeImage) {
        this.x = x
        this.y = y
        this.radius = radius 
        this.color = color
        this.velocity = velocity
        this.upgradeImage = upgradeImage;
    }
    draw() {
        c.drawImage(
            this.upgradeImage,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        )
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
};

const friction = 0.98; //closer to zero moves particles more slowly
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius 
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 
            0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }
    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
};

const x = canvas.width / 2;
const y = canvas.height / 2;


let player = new Player(x, y, 15);
let projectiles = [];
let enemies = [];
let particles = [];
let upgrades = [];
let animationId;
let intervalId;
let upgradeInterval
let score = 0;

function init() {
    player = new Player(x, y, 15)
    projectiles = []
    enemies = []
    particles = []
    upgrades = []
    animationId
    score = 0
    scoreEl.innerHTML = 0
    checkMusicToggle()
};

function spawnEnemies() {
    intervalId = setInterval(() => {
        console.log('intervalId');
        const radius = Math.random() * (30 - 4) + 4

        let x 
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(
            canvas.height / 2 - y, 
            canvas.width / 2 - x)
    
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        const enemyImage = new Image();
        enemyImage.src = enemySprite[Math.floor(Math.random() * enemySprite.length)];
        enemies.push(new Enemy(x, y, radius, color, velocity, enemyImage))
    }, 1000)
}

function spawnUpgrades() {
    upgradeInterval = setInterval(() => {
        const radius = 20

        let x
        let y 

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const color = 'purple'

        const angle = Math.atan2(
            canvas.height / 2 - y, 
            canvas.width / 2 - x)
    
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        const upgradeImage = new Image();
        upgradeImage.src = upgradeSprite[Math.floor(Math.random() * upgradeSprite.length)];
        upgrades.push(new Upgrade(x, y, radius, color, velocity, upgradeImage))
        console.log('New upgrade deployed!', upgrades)
    }, 60000)
}

function checkMusicToggle() {
    const backgroundMusic = document.querySelector('#backgroundMusic');
    const musicToggle = document.querySelector('.switch input[type="checkbox"]');

    if (musicToggle.checked) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
};

function animate() {
    checkMusicToggle()
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgb(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw();

    //all loops start at end of the array and iterate backwards
    //this makes it easier to remove items from the array
    //this loop updates/animates particles, and removes them
    //from the particles array when the alpha attr is <= 0
    for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index]
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update();
        }
    };
    //animate projectiles and remove from array at edge of screen
    for (let index = projectiles.length - 1; index >= 0; index--) {
        const projectile = projectiles[index]

        projectile.update()   
        //remove projectiles from left/right/top/bottom edges of screen
        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            projectiles.splice(index, 1)
        }
    };

    //Upgrade item / player tracking / hit detection
    for (let index = upgrades.length -1; index >= 0; index--) {
        const upgrade = upgrades[index]
        upgrade.update()
        //track distance between player and upgrade item
        const dist = Math.hypot(player.x - upgrade.x, player.y - upgrade.y)
        //upgrade item/ player hit detection
        if (dist - upgrade.radius - player.radius < 1) {
            score += 250
            scoreEl.innerHTML = score
            gsap.to(upgrade, {
                radius: upgrade.radius - 10,
                onComplete: () => {
                    upgrades.splice(index, 1)
                    console.log('Upgrade acquired! (upgrade item hit detection active)');
                    projectiles.forEach(projectile => {
                        projectile.hasUpgrade = true;
                    });
                }
            })
        }
    }

    for (let index = enemies.length - 1; index >= 0; index--) {
        const enemy = enemies[index]
    
        enemy.update()

        //dist tracks distance between enemies and player
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        //if distance between enemy and player is less than 1px, end game
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            clearInterval(intervalId)
            clearInterval(upgradeInterval)
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;


            modal.style.display = 'block'
            gsap.fromTo('#modal', {scale: 0.8, opacity: 0}, {
                scale: 1, opacity: 1,
                ease: 'expo'
            })
            modalScore.innerHTML = score
        }

        for (let projectilesIndex = projectiles.length - 1; projectilesIndex >= 0; projectilesIndex--) {
            const projectile = projectiles[projectilesIndex]
            //tracking 
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            
            //projectile enemy collision 
            if (dist - enemy.radius - projectile.radius < 1) {

                //create enemy particle explosion
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(
                            projectile.x, 
                            projectile.y, 
                            Math.random() * 2, 
                            enemy.color, 
                            {
                            x: (Math.random() - 0.5) * (Math.random() * 8),
                            y: (Math.random() - 0.5) * (Math.random() * 8)
                            }
                        )
                    )
                }
                //where we shrink our enemy
                if (enemy.radius - 10 > 5) {
                    score += 100
                    scoreEl.innerHTML = score
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    projectiles.splice(projectilesIndex, 1)
                } else {
                    //remove enemy if they are destroyed
                    score += 150
                    scoreEl.innerHTML = score
                    enemies.splice(index, 1)
                    projectiles.splice(projectilesIndex, 1)
                }
            }
        }
    }
};

addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2, 
        event.clientX - canvas.width / 2)
    
    //bullet speed
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }

    projectiles.push(new Projectile(
        canvas.width/2, canvas.height / 2, 5, 'white', velocity
    ))
});

button.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    spawnUpgrades()
    gsap.to('#modal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in', 
        onComplete: () => {
            modal.style.display = 'none'
        }
    })
});

startButton.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    spawnUpgrades()
    gsap.to('#startModal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in', //google gsap visualizer
        onComplete: () => {
            startModal.style.display = 'none'
        }
    })
});