// // Get the canvas and its context
// const canvas = document.getElementById('board');
// const ctx = canvas.getContext('2d');

// // Canvas size and grid dimensions
// const canvasSize = 400; // Canvas is 400x400 pixels
// const gridSize = 10; // 8x8 grid for a chessboard
// const cellSize = canvasSize / gridSize;

// // Set canvas dimensions
// canvas.width = canvasSize;
// canvas.height = canvasSize;

// // Array to store cell states
// const cells = Array(gridSize)
//     .fill(null)
//     .map(() =>
//         Array(gridSize).fill(null).map(() => ({ isActive: false, isObstacle: false }))
//     );

// // Variable to track the currently hovered cell
// let hoveredCell = { row: -1, col: -1 };

// // Draw the chessboard
// function drawBoard() {
//     for (let row = 0; row < gridSize; row++) {
//         for (let col = 0; col < gridSize; col++) {
//             // Alternate colors for the chessboard
//             const isDark = (row + col) % 2 === 0;
//             ctx.fillStyle = isDark ? '#769656' : '#eeeed2';
//             ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);

//             // Highlight if the cell is active
//             if (cells[row][col].isActive) {
//                 ctx.fillStyle = 'rgba(0, 0, 255, 1)'; // Red overlay for active cells
//                 ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
//             }

//             // Draw an obstacle
//             if (cells[row][col].isObstacle) {
//                 ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Black color for obstacles
//                 ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
//             }

//             // Highlight the hovered cell
//             if (hoveredCell.row === row && hoveredCell.col === col) {
//                 ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'; // Blue overlay for hover
//                 ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
//             }
//         }
//     }
// }

// // Utility to find Manhattan Distance
// function heuristic(a, b) {
//     return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
// }

// // A* Pathfinding Algorithm
// function aStar(start, end) {
//     const frontier = [start];
//     const cameFrom = new Map();
//     const gScore = Array(gridSize).fill(null).map(() => Array(gridSize).fill(Infinity));
//     const fScore = Array(gridSize).fill(null).map(() => Array(gridSize).fill(Infinity));

//     gScore[start.row][start.col] = 0;
//     fScore[start.row][start.col] = heuristic(start, end);

//     while (frontier.length > 0) {
//         // Find the node in frontier with the lowest fScore
//         let current = frontier.reduce((a, b) =>
//             fScore[a.row][a.col] < fScore[b.row][b.col] ? a : b
//         );

//         // If we reached the end, reconstruct the path
//         if (current.row === end.row && current.col === end.col) {
//             return reconstructPath(cameFrom, current);
//         }

//         // Remove current from frontier
//         frontier.splice(frontier.indexOf(current), 1);

//         // Explore neighbors
//         for (let [dx, dy] of [
//             [0, 1], [1, 0], [0, -1], [-1, 0]
//         ]) {
//             const neighbor = { row: current.row + dx, col: current.col + dy };

//             // Skip out-of-bound or obstacle cells
//             if (
//                 neighbor.row < 0 || neighbor.row >= gridSize ||
//                 neighbor.col < 0 || neighbor.col >= gridSize ||
//                 cells[neighbor.row][neighbor.col].isObstacle
//             ) continue;

//             // Tentative gScore
//             const tentativeGScore = gScore[current.row][current.col] + 1;

//             if (tentativeGScore < gScore[neighbor.row][neighbor.col]) {
//                 // This path is better
//                 cameFrom.set(`${neighbor.row},${neighbor.col}`, current);
//                 gScore[neighbor.row][neighbor.col] = tentativeGScore;
//                 fScore[neighbor.row][neighbor.col] = tentativeGScore + heuristic(neighbor, end);

//                 // Add to frontier if not already there
//                 if (!frontier.some(n => n.row === neighbor.row && n.col === neighbor.col)) {
//                     frontier.push(neighbor);
//                 }
//             }
//         }
//     }

//     // No path found
//     return [];
// }

// // Reconstruct path from cameFrom map
// function reconstructPath(cameFrom, current) {
//     const path = [];
//     while (cameFrom.has(`${current.row},${current.col}`)) {
//         path.push(current);
//         current = cameFrom.get(`${current.row},${current.col}`);
//     }
//     return path.reverse();
// }

// // Find all active cells
// function getActiveCells() {
//     const activeCells = [];
//     for (let row = 0; row < gridSize; row++) {
//         for (let col = 0; col < gridSize; col++) {
//             if (cells[row][col].isActive) {
//                 activeCells.push({ row, col });
//             }
//         }
//     }
//     return activeCells;
// }

// // Visualize the path on the board
// function visualizePath(path) {
//     path.forEach(cell => {
//         ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Green overlay for the path
//         ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
//     });
// }

// // Handle Pathfinding
// function performPathfinding() {
//     const activeCells = getActiveCells();
//     if (activeCells.length < 2) {
//         alert('At least two active cells are required for pathfinding!');
//         return;
//     }

//     // Use the first active cell as the start
//     const start = activeCells.shift();

//     // Find paths to all other active cells
//     activeCells.forEach(end => {
//         const path = aStar(start, end);
//         visualizePath(path);
//     });
// }

// // Button to trigger pathfinding
// const pathfindingButton = document.createElement('button');
// pathfindingButton.textContent = 'Find Path';
// pathfindingButton.style.margin = '10px';
// document.body.appendChild(pathfindingButton);
// pathfindingButton.addEventListener('click', performPathfinding);

// // Get the grid cell from mouse position
// function getCellFromCoords(x, y) {
//     const col = Math.floor(x / cellSize);
//     const row = Math.floor(y / cellSize);
//     return { row, col };
// }

// // Handle canvas click
// canvas.addEventListener('click', (event) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     const { row, col } = getCellFromCoords(x, y);
//     if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
//         // Check if the Shift key is pressed
//         if (event.shiftKey) {
//             // Place an obstacle
//             cells[row][col].isActive = !cells[row][col].isActive;
//         } else {
//             // Toggle cell active state
//             cells[row][col].isObstacle = !cells[row][col].isObstacle;        }
//         drawBoard();
//     }
// });

// // Handle mouse move for hover effect
// canvas.addEventListener('mousemove', (event) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     const { row, col } = getCellFromCoords(x, y);

//     // Update hovered cell only if it changes
//     if (hoveredCell.row !== row || hoveredCell.col !== col) {
//         hoveredCell = { row, col };
//         drawBoard();
//     }
// });

// // Clear hover effect when the mouse leaves the canvas
// canvas.addEventListener('mouseleave', () => {
//     hoveredCell = { row: -1, col: -1 };
//     drawBoard();
// });

// // Initial draw
// drawBoard();

// Debug Mode
// Canvas setup
const canvas = document.getElementById("board");
canvas.width = 600; // Bigger canvas width
canvas.height = 600; // Bigger canvas height
const ctx = canvas.getContext("2d");
const gridSize = 20; // (gridSize)x(gridSize) grid
const cellSize = canvas.width / gridSize; // Calculate cell size dynamically

// Cells array with default values
const cells = [];
for (let row = 0; row < gridSize; row++) {
    const rowArray = [];
    for (let col = 0; col < gridSize; col++) {
        let a = Math.floor(Math.random() * 100);
        if (a < 80){
            rowArray.push({ isActive: false, isObstacle: false });
        }
        else if (a <= 95){
            rowArray.push({ isActive: false, isObstacle: true });
        }
        else{
            rowArray.push({ isActive: true, isObstacle: false });
        }

        
    }
    cells.push(rowArray);
}

// Utility to find Manhattan Distance
function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Draw the board and cells
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // Fill color for active cells
            if (cells[row][col].isActive) {
                ctx.fillStyle = "blue";
            } else if (cells[row][col].isObstacle) {
                ctx.fillStyle = "black";
            } else {
                ctx.fillStyle = "white";
            }
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "gray";
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

// Draw grid cell text (f and g values)
function drawCellText(cell, g, f) {
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial'; // Slightly larger text for bigger canvas
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = cell.col * cellSize + cellSize / 2;
    const y = cell.row * cellSize + cellSize / 2;

    ctx.fillText(`g:${g}`, x, y - 8);
    ctx.fillText(`f:${f}`, x, y + 8);
}

// Visualize the current state of A* algorithm
function visualizeStep(openSet, closedSet, current, end, gScore, fScore) {
    drawBoard();

    // Highlight evaluated cells in blue
    closedSet.forEach(cell => {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
        drawCellText(cell, gScore[cell.row][cell.col], fScore[cell.row][cell.col]);
    });

    // Highlight cells in the open set in yellow
    openSet.forEach(cell => {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
        drawCellText(cell, gScore[cell.row][cell.col], fScore[cell.row][cell.col]);
    });

    // Highlight the current cell being processed
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.fillRect(current.col * cellSize, current.row * cellSize, cellSize, cellSize);

    // Highlight the end cell in red
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(end.col * cellSize, end.row * cellSize, cellSize, cellSize);
}

// Finalize the path in orange
function visualizeFinalPath(path) {
    path.forEach(cell => {
        ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'; // Orange for the final path
        ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
    });
}

// Asynchronous A* Pathfinding Algorithm with Visualization
async function aStarVisualized(start, end) {
    const openSet = [start];
    const closedSet = [];
    const cameFrom = new Map();
    const gScore = Array(gridSize).fill(null).map(() => Array(gridSize).fill(Infinity));
    const fScore = Array(gridSize).fill(null).map(() => Array(gridSize).fill(Infinity));

    gScore[start.row][start.col] = 0;
    fScore[start.row][start.col] = heuristic(start, end);

    while (openSet.length > 0) {
        // Find the node in openSet with the lowest fScore
        let current = openSet.reduce((a, b) =>
            fScore[a.row][a.col] < fScore[b.row][b.col] ? a : b
        );

        // Visualize the current state
        visualizeStep(openSet, closedSet, current, end, gScore, fScore);

        // Pause for visualization
        await new Promise(resolve => setTimeout(resolve, 100));

        // If we reached the end, reconstruct the path
        if (current.row === end.row && current.col === end.col) {
            const path = reconstructPath(cameFrom, current);
            visualizeFinalPath(path);
            return path;
        }

        // Remove current from openSet
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);

        // Explore neighbors
        for (let [dx, dy] of [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ]) {
            const neighbor = { row: current.row + dx, col: current.col + dy };

            // Skip out-of-bound or obstacle cells
            if (
                neighbor.row < 0 || neighbor.row >= gridSize ||
                neighbor.col < 0 || neighbor.col >= gridSize ||
                cells[neighbor.row][neighbor.col].isObstacle
            ) continue;

            // Tentative gScore
            const tentativeGScore = gScore[current.row][current.col] + 1;

            if (tentativeGScore < gScore[neighbor.row][neighbor.col]) {
                // This path is better
                cameFrom.set(`${neighbor.row},${neighbor.col}`, current);
                gScore[neighbor.row][neighbor.col] = tentativeGScore;
                fScore[neighbor.row][neighbor.col] = tentativeGScore + heuristic(neighbor, end);

                // Add to openSet if not already there
                if (!openSet.some(n => n.row === neighbor.row && n.col === neighbor.col)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    // No path found
    return [];
}

// Reconstruct path from cameFrom map
function reconstructPath(cameFrom, current) {
    const path = [];
    while (cameFrom.has(`${current.row},${current.col}`)) {
        path.push(current);
        current = cameFrom.get(`${current.row},${current.col}`);
    }
    return path.reverse();
}

// Find all active cells
function getActiveCells() {
    const activeCells = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (cells[row][col].isActive) {
                activeCells.push({ row, col });
            }
        }
    }
    return activeCells;
}

// Perform pathfinding for all active cells
async function performPathfindingVisualized() {
    const activeCells = getActiveCells();
    if (activeCells.length < 2) {
        alert('At least two active cells are required for pathfinding!');
        return;
    }

    const start = activeCells.shift();
    for (let end of activeCells) {
        await aStarVisualized(start, end);
    }
}

// Mouse interaction
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / cellSize);
    const row = Math.floor((e.clientY - rect.top) / cellSize);

    if (e.shiftKey) {
        cells[row][col].isActive = !cells[row][col].isActive;
    } else {
        cells[row][col].isObstacle = !cells[row][col].isObstacle;
    }
    drawBoard();
});

// Button to trigger pathfinding
const pathfindingButton = document.createElement("button");
pathfindingButton.textContent = "Find Path (Visualized)";
pathfindingButton.style.margin = "10px";
document.body.appendChild(pathfindingButton);
pathfindingButton.addEventListener("click", performPathfindingVisualized);

// Initial draw
drawBoard();
