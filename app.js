// Global board state tracking: tracks which character is sitting in which tile slot index (0-7)
let boardState = [0, 1, 2, 3, 4, 5, 6, 7];

// Injection function to draw characters and toggle home-glow visual states
function renderBoard() {
    boardState.forEach((characterId, currentTileIndex) => {
        const targetTile = document.querySelector(`[data-tile-id="${currentTileIndex}"]`);
        const slot = targetTile.querySelector('.character-slot');

        slot.innerHTML = "";
        slot.classList.remove('at-home');

        if (characterId !== 7) {
            slot.innerHTML = animalTemplates[characterId];

            // Critical feature check: If animal ID equals current tile index, ignite glow!
            if (characterId === currentTileIndex) {
                slot.classList.add('at-home');
            }
        }
    });
}

console.log("puzzle_library", puzzleLibrary[0][2]);

// Placeholder difficulty shuffler action routing hook
function triggerDifficultySelection(modeName) {
    console.log(`Difficulty Selected: ${modeName}. Ready to connect scramble loop array mapping rules!`);
}

// Fire initial build map when layout loads
window.addEventListener('DOMContentLoaded', () => {
    renderBoard();

    // Reset button action handler
    document.getElementById('btn-reset').addEventListener('click', () => {
        boardState = [0, 1, 2, 3, 4, 5, 6, 7];
        renderBoard();
    });

    // Embedded difficulty button action listeners
    document.getElementById('scramble-easy').addEventListener('click', () => triggerDifficultySelection('Easy'));
    document.getElementById('scramble-medium').addEventListener('click', () => triggerDifficultySelection('Medium'));
    document.getElementById('scramble-hard').addEventListener('click', () => triggerDifficultySelection('Hard'));

    // Show Solution button action handler
    document.getElementById('btn-solution').addEventListener('click', () => {
        console.log("Show Solution requested.");
    });

    // Info button action handler
    document.getElementById('btn-info').addEventListener('click', () => {
        console.log("Rules modal clicked.");
    });
});
