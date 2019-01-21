const canvas = document.getElementById('canvas')
let parent = document.getElementById('canvas-holder')
let bst = require('BinarySearchTree')

class Draw{
    constructor(){
        this.ctx = canvas.getContext('2d')
    }

    drawGoose(){
        
    }
}

function resizeCanvas(){
    canvas.width  = parent.offsetWidth
    canvas.height = parent.offsetHeight
}

window.onload = () =>{
    resizeCanvas()
}

window.onresize = () =>{
    resizeCanvas()
}