// Global Audio Configuration
const bgAudio = new Audio("background-track.mp3");
bgAudio.loop = true;
bgAudio.volume = 0.3; // Kept low so it stays in the background

let isMusicPlaying = false;
let isVictorySoundPlayed = false; // Prevents the chime from rapid-firing loops
function playGameMusic() {
    if (!isMusicPlaying) {
        bgAudio.play()
        .then(() => {
            isMusicPlaying = true;
            console.log("Background music started successfully.");
        })
        .catch(err => {
            console.log("Audio failed to play:", err);
        });
    }
}

function playSwipeSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // 1. GENERATE REAL WHITE NOISE (Air texture)
    const bufferSize = ctx.sampleRate * 0.25; // 0.25 seconds of audio space
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill the buffer with random values to create pure noise friction
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // 2. FILTER THE NOISE (Shakes off the harshness, leaves the breeze)
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass"; // Only allows a narrow band of frequencies through

    // Sweep the filter frequency down to simulate a passing rush of air
    filter.frequency.setValueAtTime(1200, now); // Start with a crisp mid-high breeze
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.22); // Glide down to a soft hum
    filter.Q.setValueAtTime(3, now); // Keeps the sound focused and smooth

    // 3. SMOOTH VOLUME ENVELOPE (Swells and fades like a real swipe)
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.05); // Organic 50ms fade-in swell
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22); // Smooth trailing decay

    // Connect the chain: Noise -> Filter -> Volume -> Output
    noiseSource.connect(filter).connect(gain).connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.23);
}

// Helper to play a single cascading chime with a customizable pitch factor
function playSingleChime(pitchMultiplier = 1.0) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const now = ctx.currentTime;
    // Bright pentatonic notes: E5, F#5, G#5, B5
    const baseNotes = [659.25, 739.99, 830.61, 987.77];

    baseNotes.forEach((freq, index) => {
        // Shift the entire chord up or down based on the multiplier
        const shiftedFreq = freq * pitchMultiplier;
        const noteStartTime = now + (index * 0.06); // Fast 60ms roll

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(shiftedFreq, noteStartTime);

        gain.gain.setValueAtTime(0.001, noteStartTime);
        gain.gain.linearRampToValueAtTime(0.10, noteStartTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStartTime + 0.45); // Snappy ring out

        // Shimmer detune layer
        const oscDetune = ctx.createOscillator();
        const gainDetune = ctx.createGain();

        oscDetune.type = "sine";
        oscDetune.frequency.setValueAtTime(shiftedFreq * 1.004, noteStartTime);

        gainDetune.gain.setValueAtTime(0.001, noteStartTime);
        gainDetune.gain.linearRampToValueAtTime(0.03, noteStartTime + 0.02);
        gainDetune.gain.exponentialRampToValueAtTime(0.001, noteStartTime + 0.45);

        osc.connect(gain).connect(ctx.destination);
        oscDetune.connect(gainDetune).connect(ctx.destination);

        osc.start(noteStartTime);
        osc.stop(noteStartTime + 0.50);
        oscDetune.start(noteStartTime);
        oscDetune.stop(noteStartTime + 0.50);
    });
}

// Main victory function that sequences three chimes together
function playVictoryChime() {
    // 1. First chime plays at normal pitch
    playSingleChime(1.0);

    // 2. Second chime plays 280ms later, shifted slightly up (to an F# focus)
    setTimeout(() => {
        playSingleChime(1.12);
    }, 280);

    // 3. Third chime plays 560ms later, resolved higher (to a G# focus)
    setTimeout(() => {
        playSingleChime(1.26);
    }, 560);
}

// Global board state tracking array mapping rule configuration rules
// 0-6 are animal character IDs, 7 is the empty slot.
// The array index represents the physical spatial position on the board.

// --- GLOBAL ENGINE STATE ---
let boardState = [0, 1, 2, 3, 4, 5, 6, 7];
let moveCount = 0;
let activeSolutionSteps = []; // Holds the array elements from column 8 onwards
let isSolutionVisible = false; // Tracks the "Eye" toggle state

// Maps character IDs directly to our explicit stylesheet classes
const JEWEL_COLOR_CLASSES = [
    'jewel-red',    // 0
'jewel-orange', // 1
'jewel-yellow', // 2
'jewel-blue',   // 3
'jewel-green',  // 4
'jewel-purple', // 5
'jewel-teal'    // 6
];

/**
 * Colors the jewel track to display the character solution guide sequence
 */
function updateJewelTrack() {
    const jewels = document.querySelectorAll('#jewel-track .jewel');
    const isSolved = boardState.every((val, index) => val === index);

    // Grab the live step recipe straight out of your database slice
    const rawDynamicSolution = findSolutionFromLibrary();
    const activeMoves = rawDynamicSolution.filter(move => move !== -1 && move !== '-1');
    const unlitCount = jewels.length - activeMoves.length;

    // Build the 10-element layout map array template from left to right
    let targetLayoutClasses = [];
    for (let i = 0; i < unlitCount; i++) {
        targetLayoutClasses.push('unlit');
    }
    activeMoves.forEach((characterColorId) => {
        targetLayoutClasses.push(JEWEL_COLOR_CLASSES[characterColorId]);
    });

    // Paint the physical DOM nodes cleanly
    jewels.forEach((jewel, index) => {
        jewel.className = 'jewel'; // Reset previous layout classes
        jewel.style.opacity = "1.0";

        if (isSolved) {
            // CRITICAL: Overrides everything! Always flash victorious green when finished

            jewel.classList.add('solved');

        } else {
            const layoutClass = targetLayoutClasses[index];

            // If the slot is supposed to show a color, but the eye is flipped off, mask it!
            if (layoutClass !== 'unlit' && !isSolutionVisible) {
                jewel.classList.add('hidden-mode');
            } else {
                jewel.classList.add(layoutClass);
            }
        }
    });
    // FIRE SOUND: Trigger the sparkling chime cascade!
    // (We check moveCount > 0 so it doesn't accidentally trigger on initial page load)
    // FIRE SOUND: Let's remove the moveCount condition entirely for testing.
    // Instead, we'll use a safer fallback check so it doesn't fire on the very first page load.
    // 3. FORCE TRIGGER GATE
    // We remove 'isFirstLaunch' for a brief second just to see if the reset button forces it!
    // Only play if we haven't already rung the bells for this specific win
    if (!isVictorySoundPlayed && isSolved) {
        console.log("🚀 Victory condition met! Triggering playVictoryChime()...");
        playVictoryChime();
        isVictorySoundPlayed = true; // Lock it until the next scramble
    }
    console.log("--------------------------------");
}
/**
 * Grabs a slice from your puzzleLibrary array, parses it, and populates the board.
 */
function scrambleBoardByDifficulty(tierName) {
    // Safety check: Ensure the final library array is completely loaded into memory
    if (typeof puzzleLibrary === 'undefined' || !Array.isArray(puzzleLibrary)) {
        console.error("Error: puzzleLibrary array from puzzle_library_final.js not detected.");
        alert("Puzzle library file missing or not loaded yet!");
        return;
    }

    const bounds = SCHRAMBLE_PRESETS[tierName];
    if (!bounds) return;

    // Pick a uniform random index inclusive of your precise bounds
    const randomIndex = Math.floor(Math.random() * (bounds.maxIndex - bounds.minIndex + 1)) + bounds.minIndex;

    // Safely pull the target state vector (e.g., [3, 4, 2, 7, 8, 5, 6, 1] or similar string format)
    const targetScramble = puzzleLibrary[randomIndex];

    console.log(`Loading ${tierName} puzzle at Library Index [${randomIndex}]:`, targetScramble);

    // Parse and apply the state string into our live board array mechanics
    applyLibraryState(targetScramble);
}

/**
 * Translates the pulled library state array into your active 0-7 boardState.
 * (Adjust this string splitter if your puzzleLibrary entries use commas or spaces)
 */
function applyLibraryState(libraryEntry) {
    let rawStateArray = [];

    if (Array.isArray(libraryEntry)) {
        rawStateArray = libraryEntry;
    } else if (typeof libraryEntry === 'string') {
        // Fallback split parsing if entries are stored as comma/space separated strings
        rawStateArray = libraryEntry.replace(/[\[\]]/g, '').split(/[\s,]+/);
    }

    // Map your incoming library integers down to your functional 0-7 game values
    // NOTE: If your library states are stored directly using your game's native 0-7 format,
    // you can swap this translation with: boardState = rawStateArray.map(Number);
    boardState = rawStateArray.map(val => parseInt(val, 10));

    // Refresh the grid graphics immediately
    renderBoard();
}
function renderBoard() {
    boardState.forEach((characterId, currentTileIndex) => {
        const targetTile = document.querySelector(`[data-tile-id="${currentTileIndex}"]`);

        if (!targetTile) return;
        const slot = targetTile.querySelector('.character-slot');
        if (!slot) return;

        // Clean out previous frame assets
        slot.innerHTML = "";
        slot.classList.remove('at-home');

        // --- THE FIXED BASE TILE FIX ---
        // Base tiles NEVER move! Their skin is tied 100% to their physical screen coordinate.
        if (currentTileIndex === 7) {
            targetTile.className = "tile tile-empty"; // Position 7 is ALWAYS the white base slot
        } else {
            targetTile.className = `tile tile-${currentTileIndex + 1}`; // Positions 0-6 keep their colors permanently
        }

        // --- THE CHARACTER OVERLAY ---
        // Now, place the moving character asset inside that fixed base tile frame
        if (characterId !== 7) {
            if (typeof animalTemplates !== 'undefined' && animalTemplates[characterId]) {
                slot.innerHTML = animalTemplates[characterId];
            } else {
                slot.innerText = characterId;
            }

            // Glow pulses if the character matches the background tile coordinate index
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

// Executes raw array value mutation: Slide first, then Swap its neighbors!
function executeTileMove(tileIndex) {
    const emptyIndex = boardState.indexOf(7);

    if (isLegallyAdjacent(tileIndex, emptyIndex)) {
        // 1. Slide character
        const tempSlide = boardState[emptyIndex];
        boardState[emptyIndex] = boardState[tileIndex];
        boardState[tileIndex] = tempSlide;

        // 2. Swap neighbors
        const neighborsToSwap = getNeighborsToSwap(tileIndex, emptyIndex);
        if (neighborsToSwap.length === 2) {
            const [idxA, idxB] = neighborsToSwap;
            const tempSwap = boardState[idxA];
            boardState[idxA] = boardState[idxB];
            boardState[idxB] = tempSwap;
        }
        // FIRE SOUND: Play the mechanical swipe sound instantly
        playSwipeSound();

        // 3. Re-render UI and query library map for the new layout colors
        renderBoard();
        updateJewelTrack();
    }
}

/**
 * Searches the puzzleLibrary for an entry matching the current board state
 * and returns the remaining solution step slice.
 */
function findSolutionFromLibrary() {
    if (typeof puzzleLibrary === 'undefined' || !Array.isArray(puzzleLibrary)) {
        console.error("puzzleLibrary is not loaded.");
        return [];
    }

    // Convert our live array to a clean string format for reliable matching
    // e.g., "0,1,2,3,4,5,6,7"
    const currentBoardStr = boardState.join(',');

    for (let i = 0; i < puzzleLibrary.length; i++) {
        let rawEntry = puzzleLibrary[i];
        let entryArray = [];

        // Parse format seamlessly whether it's a raw array or a string representation
        if (Array.isArray(rawEntry)) {
            entryArray = rawEntry.map(Number);
        } else if (typeof rawEntry === 'string') {
            entryArray = rawEntry.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number);
        }

        // Slice out just the first 8 digits (the board layout configuration)
        const entryLayoutStr = entryArray.slice(0, 8).join(',');

        // If it matches our current physical layout, we found our path!
        if (currentBoardStr === entryLayoutStr) {
            // Return everything from index 8 onwards (the exact color solution sequence)
            return entryArray.slice(8);
        }
    }

    // Fallback: If the user made a wild move that isn't indexed in the library, return empty
    return [];
}

/**
 * Returns an array containing the two structural positions that must swap
 * based on which position the tile slid FROM, and which neighbor was the empty spot.
 */
function getNeighborsToSwap(fromIndex, emptyIndex) {
    // Definitive map of all 3 structural connections for every board cell index
    const masterGraph = {
        0: [1, 4, 3], // 3 is via top pink door portal
        1: [0, 2, 5],
        2: [1, 3, 6],
        3: [2, 7, 0], // 7 is vertical, 0 is via top pink door portal
        4: [5, 0, 7], // 7 is via bottom teal door portal
        5: [4, 6, 1],
        6: [5, 7, 2],
        7: [6, 3, 4]  // 3 is vertical, 4 is via bottom teal door portal
    };

    // Grab all 3 paths for the tile that just moved
    const allPaths = masterGraph[fromIndex];

    // Filter out the emptyIndex (the path the tile just slid down)
    // This leaves us with exactly the remaining two neighbors!
    return allPaths.filter(neighborIndex => neighborIndex !== emptyIndex);
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

    if (typeof puzzleLibrary === 'undefined' || !Array.isArray(puzzleLibrary)) {
        console.error("Error: puzzleLibrary array not detected.");
        return;
    }

    let minIdx = 13;
    let maxIdx = 107; // Defaulting to your clean Easy tier bounds

    if (modeName === 'Medium') { minIdx = 108; maxIdx = 888; }
    else if (modeName === 'Hard') { minIdx = 889; maxIdx = puzzleLibrary.length - 1; }

    const randomIndex = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx;
    const targetScramble = puzzleLibrary[randomIndex];

    // Ensure we handle both string formats and native sub-arrays smoothly
    let rawArray = [];
    if (Array.isArray(targetScramble)) {
        rawArray = targetScramble.map(Number);
    } else if (typeof targetScramble === 'string') {
        rawArray = targetScramble.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number);
    }

    // --- PRE-CALCULATE AND SET THE SOLUTION ---
    // Extract the solution right away so it's locked in behind the scenes
    activeSolutionSteps = rawArray.slice(8);
    const finalScrambledState = rawArray.slice(0, 8);

    // --- UI CLEANUP BEFORE ANIMATION ---
    moveCount = 0;
    isSolutionVisible = false; // Reset eye visibility to blind mode for the fresh puzzle

    const eyeButton = document.getElementById('btn-eye-solution');
    if (eyeButton) {
        eyeButton.classList.add('inactive'); // Force it to look unlit
    }

    // Instantly close the menu dialog overlay so the user can see the board shuffle
    document.getElementById('menu-overlay').classList.remove('active');

    // Temporarily disable tile interactions during the shuffle sequence
    const boardContainer = document.getElementById('board-container'); // Double check if this matches your wrapper ID
    if (boardContainer) boardContainer.style.pointerEvents = 'none';

    // --- START THE CINEMATIC SHUFFLE ---
    let durationCounter = 0;
    const totalAnimationTime = 2500; // 2.5 seconds feels punchy and fast!
    const frameIntervalTime = 250;    // How fast characters swap locations (in ms)

    const shuffleInterval = setInterval(() => {
        // Generate a quick, chaotic array of numbers 0-7 for visual flavor
        let chaoticState = [];
        while (chaoticState.length < 8) {
            let randomId = Math.floor(Math.random() * 8);
            if (!chaoticState.includes(randomId)) {
                chaoticState.push(randomId);
            }
        }

        // Feed the visual board renderer this fake, chaotic state frame
        boardState = chaoticState;
        renderBoard();

        durationCounter += frameIntervalTime;

        // --- THE LAST STEP: DROP IN THE ACTUAL SCRAMBLE ---
        if (durationCounter >= totalAnimationTime) {
            clearInterval(shuffleInterval);

            // Plop in the true target puzzle scramble layout
            boardState = finalScrambledState;

            // Final rendering pass to make everything match perfectly
            renderBoard();
            updateJewelTrack();

            // Re-enable player touch interactions now that the shuffle is complete
            if (boardContainer) boardContainer.style.pointerEvents = 'auto';
            console.log("Shuffle complete. Real puzzle loaded.");
        }
    }, frameIntervalTime);
}
// Keep track of whether the player has broken past the first screen launch
let isFirstLaunch = true;
window.addEventListener('DOMContentLoaded', () => {
    // 1. READ PREVIOUS TRACK STATE SPECIFICALLY FOR MUSIC
    // Defaults to false (unmuted) if they've never interacted with it before
    let isMusicMuted = localStorage.getItem('musicMuted') === 'false';

    const soundOnSvg = document.getElementById('svg-sound-on');
    const soundOffSvg = document.getElementById('svg-sound-off');
    const audioToggleBtn = document.getElementById('btn-audio-toggle');

    // 2. INITIAL COMPLIANCE CHECK ON APP BOOT
    if (isMusicMuted) {
        soundOnSvg.style.display = 'none';
        soundOffSvg.style.display = 'block';
        if (typeof bgAudio !== 'undefined') {
            bgAudio.volume = 0; // Completely silence the audio object line
        }
    } else {
        soundOnSvg.style.display = 'block';
        soundOffSvg.style.display = 'none';
        if (typeof bgAudio !== 'undefined') {
            bgAudio.volume = 0.15; // Standard background ambiance floor level
        }
    }

    // 3. LISTEN FOR VOLTAGE FLIPS ON THE BUTTON
    audioToggleBtn.addEventListener('click', (e) => {
        // Prevents ambient ghost-clicks on underlying puzzle layers
        e.stopPropagation();

        isMusicMuted = !isMusicMuted;
        localStorage.setItem('musicMuted', isMusicMuted); // Lock into client storage

        if (isMusicMuted) {
            soundOnSvg.style.display = 'none';
            soundOffSvg.style.display = 'block';
            if (typeof bgAudio !== 'undefined') {
                bgAudio.volume = 0; // Turn off music instantly
            }
            console.log("Background music tracks muted.");
        } else {
            soundOnSvg.style.display = 'block';
            soundOffSvg.style.display = 'none';
            if (typeof bgAudio !== 'undefined') {
                bgAudio.volume = 0.15; // Restore music volume
            }

            // Wake up loop just in case mobile device autoplay blocks had it asleep
            if (typeof playGameMusic === 'function') {
                playGameMusic();
            }
            console.log("Background music tracks unmuted.");
        }
    });
    renderBoard();
    initializeMovementEngine();

    const overlay = document.getElementById('menu-overlay');
    const continueBtn = document.getElementById('menu-btn-continue');

    // --- FORCE MENU OPEN ON LAUNCH FRAME ---
    if (isFirstLaunch) {
        overlay.classList.add('active');
        continueBtn.innerText = "Explore"; // Swap label for first-time welcome onboarding
    }

    // Inside your existing Continue/Explore click handler:
    continueBtn.addEventListener('click', () => {
        overlay.classList.remove('active');

        // The moment they tap past the first screen, tear down the first-launch flag!
        if (isFirstLaunch) {
            isFirstLaunch = false;
            continueBtn.innerText = "Continue"; // Revert button back to standard gameplay label
        }
    });

    // Inside your existing Menu Trigger click handler:
    document.getElementById('btn-menu-trigger').addEventListener('click', () => {
        // Double-check to ensure it always says Continue when summoned manually mid-game
        if (!isFirstLaunch) {
            continueBtn.innerText = "Continue";
        }
        overlay.classList.add('active');
    });
    // Inside DOMContentLoaded:
    const eyeButton = document.getElementById('btn-eye-solution');

    eyeButton.addEventListener('click', () => {
        // Toggle the visibility state boolean
        isSolutionVisible = !isSolutionVisible;

        console.log(`Solution Visibility Toggled: ${isSolutionVisible}`);

        // Toggle look of the button to show users it's active/inactive
        if (isSolutionVisible) {
            eyeButton.classList.remove('inactive');
        } else {
            eyeButton.classList.add('inactive');
        }

        // Instantly update the jewel track graphics frame
        updateJewelTrack();
    });

    document.getElementById('btn-menu-trigger').addEventListener('click', () => {
        isVictorySoundPlayed = false;
        playGameMusic();
        overlay.classList.add('active');
    });

    document.getElementById('menu-btn-continue').addEventListener('click', () => {
        isVictorySoundPlayed = false;
        playGameMusic();
        overlay.classList.remove('active');
    });

    // Inside your reset button listener:
    document.getElementById('menu-btn-reset').addEventListener('click', () => {
        boardState = [0, 1, 2, 3, 4, 5, 6, 7];
        moveCount = 0; // Clear moves
        playGameMusic();
        renderBoard();
        updateJewelTrack(); // Clear jewels
        overlay.classList.remove('active');
    });

    document.getElementById('menu-btn-info').addEventListener('click', () => {
        console.log("Rules modal route opened.");
    });

    document.getElementById('scramble-easy').addEventListener('click', () => {
        isVictorySoundPlayed = false;
        playGameMusic();
        triggerDifficultySelection('Easy');
    });

    document.getElementById('scramble-medium').addEventListener('click', () => {
        isVictorySoundPlayed = false;
        playGameMusic();
        triggerDifficultySelection('Medium');
    });

    document.getElementById('scramble-hard').addEventListener('click', () => {
        isVictorySoundPlayed = false;
        playGameMusic();
        triggerDifficultySelection('Hard');
    });
    // --- SECONDARY COUPLING OVERLAY EVENT LISTENERS ---
    const customRulesOverlay = document.getElementById('custom-rules-overlay');
    const infoButtonTrigger = document.getElementById('menu-btn-info');
    const closeRulesTrigger = document.getElementById('btn-custom-rules-close');

    // Open the new standalone overlay when "Info & Rules" is touched
    if (infoButtonTrigger) {
        infoButtonTrigger.addEventListener('click', () => {
            if (customRulesOverlay) {
                customRulesOverlay.style.display = 'block'; // Changed from 'flex' to unlock natural container scrolling
            }
        });
    }

    // Hide the new standalone overlay when "Back to Menu" is touched
    if (closeRulesTrigger) {
        closeRulesTrigger.addEventListener('click', () => {
            if (customRulesOverlay) {
                customRulesOverlay.style.display = 'none'; // Turn visibility off instantly
            }
        });
    }
});
