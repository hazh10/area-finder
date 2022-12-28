const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d");

document.body.style.margin = 0;

canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
canvas.onmousedown = function(e) { if (e.button === 1) return false; }

// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

// Set the "actual" size of the canvas
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

// Scale the context to ensure correct drawing operations
ctx.scale(dpr, dpr);

// Set the "drawn" size of the canvas
canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}


let ci = 0;

let grid_amount = 75;
let wg = canvas.width/grid_amount
let hg = canvas.width/grid_amount

let mousePosition = {x: 0, y: 0};

let closestX = -1;
let closestY = -1;

function setMousePosition(e) {
    mousePosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    closestX = -1;
    closestY = -1;

    let lastX = 9999;
    let lastY = 9999;

    let lastxx = 0;
    let lastyy = 0;

    for (let x = 0; x < grid_amount; x++) {
        for (let y = 0; y < grid_amount; y++) {
            // if (Math.abs(mousePosition.x-(x*wg+(wg/3))) < lastX) {
            //     lastX = Math.abs(mousePosition.x-(x*wg+(wg/3)))
            //     lastxx = x;
            // }
            // if (Math.abs(mousePosition.y-(y*hg+(hg/3)+5)) < lastY) {
            //     lastY = Math.abs(mousePosition.y-(y*hg+(hg/3)+5))
            //     lastyy = y;
            // }
            if (Math.abs(mousePosition.x-(x*cm)) < lastX) {
                lastX = Math.abs(mousePosition.x-(x*cm))
                lastxx = x;
            }
            if (Math.abs(mousePosition.y-(y*cm+5)) < lastY) {
                lastY = Math.abs(mousePosition.y-(y*cm+5))
                lastyy = y;
            }
        }
    }

    closestX = lastxx;
    closestY = lastyy;
}

window.addEventListener('mousemove', setMousePosition, false);
let mode = "square"

let points = []
let cols = []

let selectedShape = 0;
let selectedPoint = 0;
let selected = false;

let shapeType = 0;

window.addEventListener('mousedown', (e) => {
    if (e.button == 0) {
        if (mode === "square") {
            points.push([[closestX, closestY],[closestX+2, closestY],[closestX+2, closestY+2],[closestX, closestY+2]])
            cols.push(Math.floor(Math.random()*5))
            console.log(cols)
        }
    }
    if (e.button == 1) {
        points.forEach(function(shape, i) {
            shape.forEach(function(point, j) {
                if (point[0] == closestX && point[1] == closestY) {
                    points.splice(i, 1)
                    cols.splice(i, 1)
                }
            })
        })
    }
    if (e.button == 2) {
        points.forEach(function(shape, i) {
            shape.forEach(function(point, j) {
                if (point[0] == closestX && point[1] == closestY) {
                    selected = true
                    selectedShape = i
                    selectedPoint = j
                }
            })
        })
    }
},  false);


window.addEventListener("mouseup", function(e) {
    if (e.button == 2) {
        if (selected) {
            points[selectedShape][selectedPoint] = [closestX, closestY];
            selected = false
            selectedShape = 0;
            selectedPoint = 0;
        }
    }
}, false)

function ccw(a,b,c) {
    return (c[1]-a[1])*(b[0]-a[0]) > (b[1]-a[1])*(c[0]-a[0])
}

function distance(a,b) {
    return Math.round(Math.sqrt((b[1]-a[1])**2 + (b[0]-a[0])**2))
}
function distanceA(a,b) {
    return Math.round(Math.sqrt((b-a)**2))
}

function slope(a, b) {
    let x1 = a[0];
    let y1 = a[1];
    let x2 = b[0];
    let y2 = b[1];
    return (y2-y1)/(x2-x1)
}

function slopeD(a, b) {
    let x1 = a[0];
    let y1 = a[1];
    let x2 = b[0];
    let y2 = b[1];
    return Math.atan((y2-y1)/(x2-x1)) * (180/Math.PI)
}

let cm = 96 / 2.54

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ci = lerp(ci, 30, 0.2)

    ctx.fillStyle = "rgb("+ci+","+ci+","+ci+")"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(94, 94, 94)"

    // console.log(selected)
    // console.log(selectedShape)
    // console.log(selectedPoint)

    for (let x = 0; x < grid_amount; x++) {
        for (let y = 0; y < grid_amount; y++) {
            if (closestX != -1 && closestX == x && closestY != -1 && closestY == y) {
                ctx.fillStyle = "white"
            }
            ctx.beginPath();
            ctx.ellipse(x*cm, y*cm+5, 2, 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "rgb(94, 94, 94)"
        }
    }

    

    points.forEach(function(shape, j) {
        switch (cols[j]) {
            case 0:
                ctx.strokeStyle = 'rgb(199, 68, 64)';
                ctx.fillStyle = 'rgba(199, 68, 64, 0.4)';
                break;
            case 1:
                ctx.strokeStyle = 'rgb(45, 112, 179)';
                ctx.fillStyle = 'rgba(45, 112, 179, 0.4)';
                break;
            case 2:
                ctx.strokeStyle = 'rgb(56, 140, 70)';
                ctx.fillStyle = 'rgba(56, 140, 70, 0.4)';
                break;
            case 3:
                ctx.strokeStyle = 'rgb(250, 126, 25)';
                ctx.fillStyle = 'rgba(250, 126, 25, 0.4)';
                break;
            case 4:
                ctx.strokeStyle = 'rgb(96, 66, 166)';
                ctx.fillStyle = 'rgba(96, 66, 166, 0.4)';
                break;
        }
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        let dist = 0.0;

        let canBeSquare = true;
        let canBeRectangle = true;

        //https://math.stackexchange.com/a/4285922

        shape.forEach(function(point,i) {
            // if (i == 0) {
            //     ctx.moveTo(point[0]*wg+(wg/3), point[1]*hg+(hg/3)+5);
            // } else {
            //     ctx.lineTo(point[0]*wg+(wg/3),point[1]*hg+(hg/3)+5);
            // }
            // ctx.ellipse(point[0]*wg+(wg/3), point[1]*hg+(hg/3)+5, 2, 2, 0, 0, 2 * Math.PI);
            
            if (i == 0) {
                ctx.moveTo(point[0]*cm, point[1]*cm+5);
            } else {
                ctx.lineTo(point[0]*cm,point[1]*cm+5);
            }
            ctx.ellipse(point[0]*cm, point[1]*cm+5, 2, 2, 0, 0, 2 * Math.PI);
            

        })


        let A = shape[0]
        let B = shape[1]
        let C = shape[2]
        let D = shape[3]

        let AB = distance(A, B)
        let BC = distance(B, C)
        let CD = distance(C, D)
        let DA = distance(D, A)
        let AC = distance(A, C)
        let BD = distance(B, D)

        shapeType = 4

        // let aX = distanceA(A[0],B[0])
        // let aY = distanceA(A[1],B[1])
        // let bX = distanceA(B[0],C[0])
        // let bY = distanceA(B[1],C[1])
        // let cX = distanceA(C[0],D[0])
        // let cY = distanceA(C[1],D[1])
        // let dX = distanceA(D[0],A[0])
        // let dY = distanceA(D[1],A[1])

        // let crossA = aX*cY-aY*cX
        // let crossB = aX*cY-aY*cX

        // if (crossA == 0 || crossB == 0) {
        //     shapeType = 3;
        // }

        if ((AB == CD) && (BC == DA)) {
            if (!(AC == BD)) {
                shapeType = 2;
            } else if (AC == BD) {
                shapeType = 1;
            }
        }

        if ((AB == BC) && (CD == DA) && AC == BD) {
            shapeType = 0
        }


        // Using the slope formula to find intersection
        let sAD = slopeD(A, D)
        let sBC = slopeD(B, C)

        let sAB = slopeD(A, B)
        let sCD = slopeD(C, D)

        // console.log(sAD + " - Slope of A and D")
        // console.log(sBC + " - Slope of B and C")
        // console.log(sAB + " - Slope of A and B")
        // console.log(sCD + " - Slope of C and D")

        // let aX = distanceA(A[0],B[0])
        // let aY = distanceA(A[1],B[1])
        // let bX = distanceA(B[0],C[0])
        // let bY = distanceA(B[1],C[1])
        // let cX = distanceA(C[0],D[0])
        // let cY = distanceA(C[1],D[1])
        // let dX = distanceA(D[0],A[0])
        // let dY = distanceA(D[1],A[1])

        // let crossA = aX*cY-aY*cX
        // let crossB = aX*cY-aY*cX

        // console.log((crossA == 0 || crossB == 0) && "Is a trapezoid" || "Is not a trapezoid")

        // console.log(aX*cY-aY*cX)
        // console.log(bX*dY-bY*dX)

        // If either pair is equal, then it is a paralellogram
        // If sign(sAB) is sign(0-sCD), or sign(sAD) is sign(0-sBC), then it is a trapezoid
        
        // console.log("AD: " + Math.atan(sAD) * (180/Math.PI))
        // console.log("BC: " + Math.atan(sBC) * (180/Math.PI))
        // console.log("AB: " + Math.atan(sAB) * (180/Math.PI))
        // console.log("CD: " + Math.atan(sCD) * (180/Math.PI))

        // A trapezoid is a shape with only one pair of parallel sides.
        // A rhombus has both sides being parallel.

        // XOR both sides to see if only one pair is parallel
        if ((sAD != sBC || sAB != sCD) && !(sAD != sBC && sAB != sCD)) {
            // One pair is not parallel
            // Both pairs are not parallel
            // Most likely a trapezoid
            
            shapeType = 3;
            
        }

        // if (((Math.sign(sAD) != Math.sign(sBC)) && !(Math.sign(sAB) != Math.sign(sCD))) || ((Math.sign(sAB) != Math.sign(sCD)) && !(Math.sign(sAD) != Math.sign(sBC)))) {
        //     shapeType = 3;
        // }
        

        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        let areaFormula = shapeType == 0 && "l x w" || shapeType == 1 && "l x w" || shapeType == 2 && "b x h" || shapeType == 3 && "½ (b₁ + b₂) x h"
        let area = 0;

        if (shapeType == 0 || shapeType == 1) {
            area = (BC+1)*(AB+1) + " cm²"
        }
        if (shapeType == 2) {
            let b = (AB+1)
            let h = distanceA(B[1], C[1])+1 // only the y
            area = b*h + " cm²"
        }
        if (shapeType == 3) {
            let b1 = 0
            let b2 = 0
            let h = 0
            if (sAB == sCD) {
                // AB is parallel to CD
                console.log("red")
                b1 = AB
                b2 = CD
                h = distanceA(A[1], D[1])
            }
            if (sAD == sBC) {
                // AB is parallel to CD
                console.log("blue")
                b1 = DA
                b2 = BC
                h = distanceA(A[0], B[0])
            }
            // let b2
            
            console.log(b1)
            console.log(b2)
            console.log(h+1)
            area = (1/2)*((b1+1)+(b2+1))*(h+1) + " cm²"
        }

        ctx.font = "30px Arial"
        ctx.fillText(shapeType == 0 && "Square" || shapeType == 1 && "Rectangle" || shapeType == 2 && "Parallelogram" || shapeType == 3 && "Trapezoid" || "Irregular", shape[0][0]*cm, (shape[0][1]*cm) - 75)
        ctx.fillText("Area: " + areaFormula, shape[0][0]*cm, (shape[0][1]*cm) - 75 + 25)
        ctx.fillText("Area: " + area, shape[0][0]*cm, (shape[0][1]*cm) - 75 + 50)
    })

    // ctx.font = "100px Arial"
    // ctx.fillText(shapeType == 0 && "Square" || shapeType == 1 && "Rectangle" || shapeType == 2 && "Parallelogram" || shapeType == 3 && "Trapezoid" || "Irregular", 700, 500)

    ctx.fillStyle = "rgba(10, 10, 10, .5)"
    ctx.fillRect(12, 587, 270, 85)
    ctx.font = "20px Arial"
    ctx.fillStyle = "rgba(90, 90, 90, 1)"
    ctx.fillText("Left Click: Add new shape", 20, 610)
    ctx.fillText("Right Click: Move point", 20, 635)
    ctx.fillText("Middle Click: Remove shape", 20, 660)
    
    
    requestAnimationFrame(render);
}



render();