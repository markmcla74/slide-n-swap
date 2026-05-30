// Global board state tracking array mapping rule configuration rules
let boardState = [0, 1, 2, 3, 4, 5, 6, 7];

function renderBoard() {
    boardState.forEach((characterId, currentTileIndex) => {
        const targetTile = document.querySelector(`[data-tile-id="${currentTileIndex}"]`);
        const slot = targetTile.querySelector('.character-slot');

        slot.innerHTML = "";
        slot.classList.remove('at-home');

        if (characterId !== 7) {
            slot.innerHTML = animalTemplates[characterId];
            if (characterId === currentTileIndex) {
                slot.classList.add('at-home');
            }
        }
    });
}

function triggerDifficultySelection(modeName) {
    console.log(`Difficulty Triggered from Overlay: ${modeName}`);
    // Close overlay once difficulty has been locked in by the player
    document.getElementById('menu-overlay').classList.remove('active');
}

window.addEventListener('DOMContentLoaded', () => {
    renderBoard();

    const overlay = document.getElementById('menu-overlay');

    // Inline Dashboard Toggles
    document.getElementById('btn-eye-solution').addEventListener('click', () => {
        console.log("Peek at Solution solution toggle loop fired!");
    });

    document.getElementById('btn-menu-trigger').addEventListener('click', () => {
        overlay.classList.add('active');
    });

    // Overlay Card Dismissals & Actions
    document.getElementById('menu-btn-continue').addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    document.getElementById('menu-btn-reset').addEventListener('click', () => {
        boardState = [0, 1, 2, 3, 4, 5, 6, 7];
        renderBoard();
        overlay.classList.remove('active');
    });

    document.getElementById('menu-btn-info').addEventListener('click', () => {
        console.log("Rules detail page route modal triggered.");
    });

    // Sub-icon option routing hooks inside card template
    document.getElementById('scramble-easy').addEventListener('click', () => triggerDifficultySelection('Easy'));
    document.getElementById('scramble-medium').addEventListener('click', () => triggerDifficultySelection('Medium'));
    document.getElementById('scramble-hard').addEventListener('click', () => triggerDifficultySelection('Hard'));
});

// --- TEST INITIALIZATION ---
// Index:         0  1  2  3  4  5  6  7
// Character ID:  0, 1, 2, 5, 4, 6, 7, 7 (7 represents Empty, 5 is our Cow/Animal)
let boardState = [0, 1, 2, 5, 4, 6, 7, 7];

let touchStartX = 0;
let touchStartY = 0;
let activeTileIndex = null; // Keeps track of which tile the user actually touched

const swipeThreshold = 30; // Minimum pixels to register a clean swipe

function renderBoard() {
    boardState.forEach((characterId, currentTileIndex) => {
        const targetTile = document.querySelector(`[data-tile-id="${currentTileIndex}"]`);
        const slot = targetTile.querySelector('.character-slot');

        slot.innerHTML = "";
        slot.classList.remove('at-home');

        // Check if this index is the empty slot
        if (characterId === 7) {
            targetTile.className = "tile tile-empty";
        } else {
            // Restore its original color class dynamically for the test layout
            targetTile.className = `tile tile-${characterId + 1}`;
            slot.innerHTML = animalTemplates[characterId];

            if (characterId === currentTileIndex) {
                slot.classList.add('at-home');
            }
        }
    });
}

// --- TARGETED SWIPE HANDLER FOR TEST CASE ---
function setupSwipeTest() {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        const tileIndex = parseInt(tile.getAttribute('data-tile-id'));

        // 1. Capture where the finger drops down on a specific tile
        tile.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            activeTileIndex = tileIndex;
        }, { passive: true });

        // 2. Lock the window from bouncing around during a drag gesture
        tile.addEventListener('touchmove', (e) => {
            if (e.cancelable) e.preventDefault();
        }, { passive: false });

            // 3. Process the direction when the finger lifts off
            tile.addEventListener('touchend', (e) => {
                if (activeTileIndex === null) return;

                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;

                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                // Enforce our threshold guardrail
                if (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
                    return;
                }

                // Isolate the vertical axis
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    if (deltaY > 0) {
                        // It's a Downward Swipe!
                        handleDownwardSwipe(activeTileIndex);
                    }
                }

                // Reset the active tracking pointer
                activeTileIndex = null;
            });
    });
}

function handleDownwardSwipe(fromIndex) {
    // Hardcoded test verification rule:
    // User must swipe Position 3 down, and Position 7 must be empty (value 7)
    if (fromIndex === 3 && boardState[7] === 7) {
        console.log("Success! Swiping Cow from Position 3 down to Position 7.");

        // Execute the array value swap
        const temp = boardState[7];
        boardState[7] = boardState[3];
        boardState[3] = temp;

        // Re-render the visual UI state changes
        renderBoard();
    } else {
        console.log(`Downward swipe ignored at position ${fromIndex}. Conditions not met.`);
    }
}

// Initialize everything on load
window.addEventListener('DOMContentLoaded', () => {
    renderBoard();
    setupSwipeTest();
});
