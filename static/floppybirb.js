window.onload=boot;

const ID_CANVAS = "idCanvas";
const ID_FEEDBACK = "idFeedback";


var oCanvas, x, rectArray, canvas,mouseX,mouseY,score, oFeedback;

function boot(){
    oCanvas = id(ID_CANVAS);
    oFeedback = id(ID_FEEDBACK);
    rectArray = [];
    oCanvas.width = 600;
    oCanvas.height = 600;
    score = 0;
    x = 500
    canvas = oCanvas.getContext("2d");
    window.addEventListener("mousemove",function(event){
        mouseX = event.x;
        mouseY = event.y;        
    })

    init()
    
}

class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw(){
        canvas.beginPath();
        canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        canvas.strokeStyle = "blue";
        canvas.stroke();
        canvas.fillStyle = "blue";
        canvas.fill();
    }

}

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
        draw() {
            canvas.fillStyle = "rgba(0,255,0,0.5)";
            canvas.fillRect(this.x, this.y, this.width, this.height);

        };
        update() {
            this.draw();
            this.x -= 2;
        };
    
}

function init(){
    player = new Circle(50,25,25)
    setInterval(()=>{
        const x = 500
        const y = 0
        const width = 100
        const height = numeroAleatorio(100,500)

        rectArray.push(new Rect(x, y, width, height))
        rectArray.push(new Rect(x, y+600, width, height-500))
    },2000)
    animate()
}
function endGame(){
    window.alert("Game Over!")
        try{
            oFeedback.innerHTML += '<input type="text" id="score" value="'+ score +'" name="score" readonly>'
            oFeedback.innerHTML += '<input type="submit" class="btn btn-primary" placeholder="submit" value="Submit Score!">'
        } finally{
            cancelAnimationFrame(reqAnim);
        }
        cancelAnimationFrame(reqAnim);
}
    


function animate(){
    reqAnim = requestAnimationFrame(animate)
    canvas.clearRect(0,0, innerWidth, innerHeight); // clears the canvas

    player.y = mouseY;
    player.draw();
    
    rectArray.forEach((rect) => {
        rect.update()
        bTopRect = rect.y == 0
        bXCol = player.x + player.radius >= rect.x && player.x + player.radius <= rect.x + rect.width;
        bYCol = player.y - player.radius <= rect.height;

        if(bTopRect && bXCol && bYCol){
            endGame();
        } else if (!bTopRect && bXCol && player.y + player.radius >= rect.y + rect.height){
            endGame();
        }
        
        if (player.x == rect.x){
            score += 0.5;
        }

        canvas.font = "30px Arial";
        canvas.fillText(score, 300, 40)

        
    })
    
}
