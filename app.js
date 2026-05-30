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
