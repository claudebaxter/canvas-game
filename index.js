const canvas = document.querySelector('canvas');
//using c instead of context because this will be repeated a lot
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

console.log(c);