// Global board state tracking array mapping rule configuration rules
// 0-6 are animals, 7 is the empty slot
let boardState = [0, 1, 2, 3, 4, 5, 6, 7];

function renderBoard() {
    boardState.forEach((characterId, currentTileIndex) => {
        const targetTile = document.querySelector(`[data-tile-id="${currentTileIndex}"]`);
        const slot = targetTile.querySelector('.character-slot');

        slot.innerHTML = "";
        slot.classList.remove('at-home');

        if (characterId === 7) {
            // Ensure the empty tile gets its distinct visual layout class
            targetTile.className = "tile tile-empty";
        } else {
            targetTile.className = `tile tile-${characterId + 1}`;
            if (typeof animalTemplates !== 'undefined' && animalTemplates[characterId]) {
                slot.innerHTML = animalTemplates[characterId];
            } else {
                // Fallback text if the template asset array hasn't loaded yet
                slot.innerText = characterId;
            }

            if (characterId === currentTileIndex) {
                slot.classList.add('at-home');
            }
        }
    });
}

// --- MASTER GESTURE & MECHANICS ENGINE ---
function initializeMovementEngine() {
    let startX = 0;
    let startY = 0;
    let startTileIndex = null;
    const swipeThreshold = 30; // Minimum pixel drag to qualify as a swipe

    const gridContainer = document.getElementById('game-grid');
    if (!gridContainer) return;

    // 1. TOUCH START: Track initial coordinates and find the targeted tile index
    gridContainer.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        // Find exactly which element your finger hit
        const hitElement = document.elementFromPoint(touch.clientX, touch.clientY);
        const closestTile = hitElement ? hitElement.closest('.tile') : null;

        if (closestTile) {
            startTileIndex = parseInt(closestTile.getAttribute('data-tile-id'));
        }
    }, { passive: true });

    // 2. TOUCH MOVE: Intercept browser scroll snapping to keep layout steady
    gridContainer.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
    }, { passive: false });

        // 3. TOUCH END: Process structural movement calculation vectors
        gridContainer.addEventListener('touchend', (e) => {
            if (startTileIndex === null) return;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            // --- GESTURE ROUTING BRANCH ---
            if (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
                // Treat small, rapid movements as an intuitive CLICK/TAP fallback
                executeTileMove(startTileIndex);
            } else {
                // Process as a standard mobile SWIPE
                processSwipeGesture(startTileIndex, deltaX, deltaY);
            }

            // Reset state tracker pointers for next loop pass
            startTileIndex = null;
        });

        // 4. CLICK FALLBACK: Keep desktop and hybrid testing responsive
        gridContainer.addEventListener('click', (e) => {
            const closestTile = e.target.closest('.tile');
            if (closestTile) {
                const index = parseInt(closestTile.getAttribute('data-tile-id'));
                executeTileMove(index);
            }
        });
}

// Evaluate swipe vectors and match them against layout target paths
function processSwipeGesture(tileIndex, deltaX, deltaY) {
    let direction = "";

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? "right" : "left";
    } else {
        direction = deltaY > 0 ? "down" : "up";
    }

    console.log(`Swipe detected: Position ${tileIndex} dragged ${direction}`);

    // Map out the targeted tile slot based on swipe direction
    let intendedTarget = null;

    if (direction === "down" && tileIndex === 3) intendedTarget = 7;
    if (direction === "up" && tileIndex === 7) intendedTarget = 3;

    // Portal Wrap Jumps (Pink Door: 0 <-> 3)
    if (direction === "left" && tileIndex === 0) intendedTarget = 3;
    if (direction === "right" && tileIndex === 3) intendedTarget = 0;

    // Portal Wrap Jumps (Teal Door: 4 <-> 7)
    if (direction === "left" && tileIndex === 4) intendedTarget = 7;
    if (direction === "right" && tileIndex === 7) intendedTarget = 4;

    // Standard contiguous horizontal/vertical steps
    if (direction === "right" && [0, 1, 2, 4, 5, 6].includes(tileIndex)) intendedTarget = tileIndex + 1;
    if (direction === "left" && [1, 2, 3, 5, 6, 7].includes(tileIndex)) intendedTarget = tileIndex - 1;
    if (direction === "down" && tileIndex <= 3) intendedTarget = tileIndex + 4;
    if (direction === "up" && tileIndex >= 4) intendedTarget = tileIndex - 4;

    // If the swiped direction directly hits the empty tile slot, execute the move!
    if (intendedTarget !== null && boardState[intendedTarget] === 7) {
        executeTileMove(tileIndex);
    }
}

// Executes raw array value mutation and triggers UI draw call changes
function executeTileMove(tileIndex) {
    const emptyIndex = boardState.indexOf(7);

    // Verify if chosen spot is legally adjacent to current empty space location
    if (isLegallyAdjacent(tileIndex, emptyIndex)) {
        // Swap values in our array matrix
        const temp = boardState[emptyIndex];
        boardState[emptyIndex] = boardState[tileIndex];
        boardState[tileIndex] = temp;

        renderBoard();
    }
}

// Enforces structural connectivity conditions (neighbor checking + loop doors)
function isLegallyAdjacent(idxA, idxB) {
    if (idxA === idxB) return false;

    // Column alignment check (Vertical moves)
    if (Math.abs(idxA - idxB) === 4) return true;

    // Row alignment check (Standard horizontal moves)
    const sameRow = Math.floor(idxA / 4) === Math.floor(idxB / 4);
    if (sameRow && Math.abs(idxA - idxB) === 1) return true;

    // Wrap-around Portal Door Rules
    if ((idxA === 0 && idxB === 3) || (idxA === 3 && idxB === 0)) return true; // Pink Top Door
    if ((idxA === 4 && idxB === 7) || (idxA === 7 && idxB === 4)) return true; // Teal Bottom Door

    return false;
}

function triggerDifficultySelection(modeName) {
    console.log(`Difficulty Triggered from Overlay: ${modeName}`);
    document.getElementById('menu-overlay').classList.remove('active');
}

// Initialization Entry Core Hook
window.addEventListener('DOMContentLoaded', () => {
    renderBoard();
    initializeMovementEngine();

    const overlay = document.getElementById('menu-overlay');

    document.getElementById('btn-eye-solution').addEventListener('click', () => {
        console.log("Peek at Solution triggered.");
    });

    document.getElementById('btn-menu-trigger').addEventListener('click', () => {
        overlay.classList.add('active');
    });

    document.getElementById('menu-btn-continue').addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    document.getElementById('menu-btn-reset').addEventListener('click', () => {
        boardState = [0, 1, 2, 3, 4, 5, 6, 7];
        renderBoard();
        overlay.classList.remove('active');
    });

    document.getElementById('menu-btn-info').addEventListener('click', () => {
        console.log("Rules modal route opened.");
    });

    document.getElementById('scramble-easy').addEventListener('click', () => triggerDifficultySelection('Easy'));
    document.getElementById('scramble-medium').addEventListener('click', () => triggerDifficultySelection('Medium'));
    document.getElementById('scramble-hard').addEventListener('click', () => triggerDifficultySelection('Hard'));
});
