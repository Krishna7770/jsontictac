import React, { useEffect, useRef } from "react";

export default function Game() {

    // i made a 3x3 matrix to store animation progress
    // 0 = empty, positive = X drawing progress, negative = O drawing progress
    // fully drawn X = 100, fully drawn O = -100
    const progressMatrix = useRef([
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]);

    // i used this queue because the clicks should go here first
    const clickQueue = useRef<{cx:number, cy:number, player:number}[]>([]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // to know who plays: X = +1, O = -1, alternating
    const currentPlayer = useRef(1);

    // animation frame
    const animRef = useRef(0);

    // i used this to draw small part of X each frame
    function drawPartialX(ctx:CanvasRenderingContext2D, px:number, py:number, progress:number) {
        // progress from 0 → 100
        // i convert cell to pixel positions here
        const size = 100;
        const x1 = px * size;
        const y1 = py * size;

        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;

        ctx.beginPath();
        // here drawn first line of X gradually
        let line1 = Math.min(progress, 50) / 50; 
        if (line1 > 0) {
            ctx.moveTo(x1 + 10, y1 + 10);
            ctx.lineTo(x1 + 10 + line1 * 80, y1 + 10 + line1 * 80);
        }

        // second line
        let line2 = Math.max(progress - 50, 0) / 50; 
        if (line2 > 0) {
            ctx.moveTo(x1 + 90, y1 + 10);
            ctx.lineTo(x1 + 90 - line2 * 80, y1 + 10 + line2 * 80);
        }

        ctx.stroke();
    }

    // and here i used same idea for drawing O but with circle piece by piece
    function drawPartialO(ctx:CanvasRenderingContext2D, px:number, py:number, progress:number) {
        // progress = -100 → 0
        const size = 100;
        const x1 = px * size + 50;
        const y1 = py * size + 50;

        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;

        ctx.beginPath();

        // negative progress so i convert it
        let pct = Math.abs(progress) / 100;
        let endAngle = pct * Math.PI * 2;

        // drawn only part of the circle depending on progress
        ctx.arc(x1, y1, 35, 0, endAngle);
        ctx.stroke();
    }

    // used this function because drawing happens many times per second
    function drawBoard(ctx:CanvasRenderingContext2D) {
        ctx.clearRect(0,0,300,300);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        // vertical lines
        ctx.beginPath();
        ctx.moveTo(100,0); ctx.lineTo(100,300);
        ctx.moveTo(200,0); ctx.lineTo(200,300);
        // horizontal lines
        ctx.moveTo(0,100); ctx.lineTo(300,100);
        ctx.moveTo(0,200); ctx.lineTo(300,200);
        ctx.stroke();

        // i now animate X and O by reading progressMatrix values
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                let v = progressMatrix.current[y][x];

                if (v > 0) {
                    // means X, still drawing until 100
                    drawPartialX(ctx, x, y, v);
                }
                else if (v < 0) {
                    // means O, still drawing until -100
                    drawPartialO(ctx, x, y, v);
                }
            }
        }
    }

    //here i used this small speed value to update animation smoothly
    function updateProgressValues() {
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                let v = progressMatrix.current[y][x];
                const animationSpeed = 1;// slow speed, and this is speed adjuster

                // X animation
                if (v > 0 && v < 100) {
                    progressMatrix.current[y][x] += animationSpeed;
                }

                // O animation
                if (v < 0 && v > -100) {
                    progressMatrix.current[y][x] -= animationSpeed;
                }
            }
        }
    }

    // as asked that queue must be processed AFTER drawing
    function processQueue() {
        if (clickQueue.current.length > 0) {
            const item = clickQueue.current.shift(); // i take first click

            if (!item) return;

            // if empty cell then start animation
            if (progressMatrix.current[item.cy][item.cx] === 0) {
                // X = +1 event → starts at small positive value
                // O = -1 event → starts at small negative value
                progressMatrix.current[item.cy][item.cx] = item.player * 3;
            }
        }
    }

    // animation loop ( used requestAnimationFrame)
    function loop() {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        drawBoard(ctx);
        updateProgressValues();
        processQueue();

        animRef.current = requestAnimationFrame(loop);
    }

    //this for clicking inside the grid
    function handleClick(e:React.MouseEvent<HTMLCanvasElement>) {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / 100);
        const y = Math.floor((e.clientY - rect.top) / 100);

        //here i push click into queue
        clickQueue.current.push({cx:x, cy:y, player:currentPlayer.current});

        // alternate X → O → X → O
        currentPlayer.current *= -1;
    }

    useEffect(() => {
        animRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <div style={{textAlign:"center"}}>
            {/* i used fixed size canvas because board is always 3x3, but for now in next week i wll upgrade it in multiple grid system*/}
            <canvas 
                ref={canvasRef}
                width={300}
                height={300}
                //style={{border:"1px solid black"}}
                onClick={handleClick}
            />
        </div>
    );
}
