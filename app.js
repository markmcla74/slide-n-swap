// Global board state tracking array mapping rule configuration rules
// 0-6 are animal character IDs, 7 is the empty slot.
// The array index represents the physical spatial position on the board.
let boardState = [0, 1, 2, 3, 4, 5, 6, 7];

function renderBoard() {
    boardState.forEach((characterId, currentTileIndex) => {
        // Find the permanent structural tile slot based on its immutable ID (0 through 7)
        const targetTile = document.querySelector(`[data-tile-id="${currentTileIndex}"]`);
        const slot = targetTile.querySelector('.character-slot');

        // Clear out whatever character was previously rendering inside this slot
        slot.innerHTML = "";
        slot.classList.remove('at-home');

        // --- THE DECOUPLING FIX ---
        // Ensure the background tile retains its PERMANENT color class based on its physical location.
        // Position 0 is always tile-1 (Pink), Position 7 is always tile-empty (White background grid slot).
        if (currentTileIndex === 7) {
            targetTile.className = "tile tile-empty";
        } else {
            targetTile.className = `tile tile-${currentTileIndex + 1}`;
        }

        // Now, place the moving Character INSIDE the fixed background tile slot
        if (characterId !== 7) {
            if (typeof animalTemplates !== 'undefined' && animalTemplates[characterId]) {
                slot.innerHTML = animalTemplates[characterId];
            } else {
                slot.innerText = characterId; // Fallback digit display
            }

            // The character is "At Home" if its own ID matches the background tile position index!
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
    const swipeThreshold = 30;

    const gridContainer = document.getElementById('game-grid');
    if (!gridContainer) return;

    gridContainer.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        const hitElement = document.elementFromPoint(touch.clientX, touch.clientY);
        const closestTile = hitElement ? hitElement.closest('.tile') : null;

        if (closestTile) {
            startTileIndex = parseInt(closestTile.getAttribute('data-tile-id'));
        }
    }, { passive: true });

    gridContainer.addEventListener('touchmove', (e) => {
        if (e.cancelable) e.preventDefault();
    }, { passive: false });

        gridContainer.addEventListener('touchend', (e) => {
            if (startTileIndex === null) return;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
                executeTileMove(startTileIndex);
            } else {
                processSwipeGesture(startTileIndex, deltaX, deltaY);
            }

            startTileIndex = null;
        });

        gridContainer.addEventListener('click', (e) => {
            const closestTile = e.target.closest('.tile');
            if (closestTile) {
                const index = parseInt(closestTile.getAttribute('data-tile-id'));
                executeTileMove(index);
            }
        });
}

function processSwipeGesture(tileIndex, deltaX, deltaY) {
    let direction = "";

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? "right" : "left";
    } else {
        direction = deltaY > 0 ? "down" : "up";
    }

    let intendedTarget = null;

    if (direction === "down" && tileIndex === 3) intendedTarget = 7;
    if (direction === "up" && tileIndex === 7) intendedTarget = 3;

    if (direction === "left" && tileIndex === 0) intendedTarget = 3;
    if (direction === "right" && tileIndex === 3) intendedTarget = 0;

    if (direction === "left" && tileIndex === 4) intendedTarget = 7;
    if (direction === "right" && tileIndex === 7) intendedTarget = 4;

    if (direction === "right" && [0, 1, 2, 4, 5, 6].includes(tileIndex)) intendedTarget = tileIndex + 1;
    if (direction === "left" && [1, 2, 3, 5, 6, 7].includes(tileIndex)) intendedTarget = tileIndex - 1;
    if (direction === "down" && tileIndex <= 3) intendedTarget = tileIndex + 4;
    if (direction === "up" && tileIndex >= 4) intendedTarget = tileIndex - 4;

    if (intendedTarget !== null && boardState[intendedTarget] === 7) {
        executeTileMove(tileIndex);
    }
}

function executeTileMove(tileIndex) {
    const emptyIndex = boardState.indexOf(7);

    if (isLegallyAdjacent(tileIndex, emptyIndex)) {
        const temp = boardState[emptyIndex];
        boardState[emptyIndex] = boardState[tileIndex];
        boardState[tileIndex] = temp;

        renderBoard();
    }
}

function isLegallyAdjacent(idxA, idxB) {
    if (idxA === idxB) return false;

    if (Math.abs(idxA - idxB) === 4) return true;

    const sameRow = Math.floor(idxA / 4) === Math.floor(idxB / 4);
    if (sameRow && Math.abs(idxA - idxB) === 1) return true;

    if ((idxA === 0 && idxB === 3) || (idxA === 3 && idxB === 0)) return true;
    if ((idxA === 4 && idxB === 7) || (idxA === 7 && idxB === 4)) return true;

    return false;
}

function triggerDifficultySelection(modeName) {
    console.log(`Difficulty Triggered from Overlay: ${modeName}`);
    document.getElementById('menu-overlay').classList.remove('active');
}

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
