
// ==========================================
// 1. GLOBAL AUDIO & LIFECYCLE CONFIGURATION
// ==========================================
const bgAudio = new Audio("background-track.mp3");
bgAudio.loop = true;
bgAudio.volume = 0.3; // Kept low so it stays in the background

let isMusicPlaying = false;
let isVictorySoundPlayed = false; // Prevents the chime from rapid-firing loops

// ⚡️ THE MASTER FIX: One single shared Web Audio context for all sound effects
let globalAudioCtx = null;

/**
 * Initializes and unlocks the global audio context on the very first user tap
 */
function initGlobalAudioContext() {
    if (globalAudioCtx) return; // Already running!

    try {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        console.log("Global Audio Context initialized. State:", globalAudioCtx.state);

        // If it's blocked by autoplay safety laws, force wake it up
        if (globalAudioCtx.state === 'suspended') {
            globalAudioCtx.resume();
        }
    } catch (e) {
        console.error("Web Audio API is not supported in this environment:", e);
    }
}

function playGameMusic() {
    // Force initialize the context whenever music tries to fire from a user interaction
    initGlobalAudioContext();

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

// ==========================================
// 2. OPTIMIZED SOUND EFFECTS (SFX) LOGIC
// ==========================================

function playSwipeSound() {
    // Ensure context exists and is awake
    initGlobalAudioContext();
    if (!globalAudioCtx) return;

    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }

    const ctx = globalAudioCtx; // Use the persistent shared engine context
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
    initGlobalAudioContext();
    if (!globalAudioCtx) return;

    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }

    const ctx = globalAudioCtx; // Use the persistent shared engine context
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

// ==========================================
// 3. GLOBAL ENGINE STATE & CORE MECHANICS
// ==========================================
let boardState = [0, 1, 2, 3, 4, 5, 6, 7];
let moveCount = 0;
let activeSolutionSteps = [];
// Eye Mode States: 0 = Open (Full Colors), 1 = Closed (Count Only), 2 = Blind (All Gray)
let eyeMode = 2;

const JEWEL_COLOR_CLASSES = [
    'jewel-red',    // 0
'jewel-orange', // 1
'jewel-yellow', // 2
'jewel-blue',   // 3
'jewel-green',  // 4
'jewel-purple', // 5
'jewel-brown'    // 6
];

function updateJewelTrack() {
    const jewels = document.querySelectorAll('#jewel-track .jewel');
    const isSolved = boardState.every((val, index) => val === index);

    const rawDynamicSolution = findSolutionFromLibrary();
    const activeMoves = rawDynamicSolution.filter(move => move !== -1 && move !== '-1');
    const unlitCount = jewels.length - activeMoves.length;

    let targetLayoutClasses = [];
    for (let i = 0; i < unlitCount; i++) {
        targetLayoutClasses.push('unlit');
    }
    activeMoves.forEach((characterColorId) => {
        targetLayoutClasses.push(JEWEL_COLOR_CLASSES[characterColorId]);
    });

    jewels.forEach((jewel, index) => {
        jewel.className = 'jewel';
        jewel.style.opacity = "1.0";

        if (isSolved) {
            jewel.classList.add('solved');
        } else {
            // Mode 2: Fully Blind -> force everything to look completely unlit/grayed out
            if (eyeMode === 2) {
                jewel.classList.add('unlit');
            } else {
                const layoutClass = targetLayoutClasses[index];
                // Mode 1: Closed -> if it's an active step, mask its true color with a generic lit state
                if (layoutClass !== 'unlit' && eyeMode === 1) {
                    jewel.classList.add('hidden-mode');
                } else {
                    jewel.classList.add(layoutClass);
                }
            }
        }
    });

    if (!isVictorySoundPlayed && isSolved) {
        console.log("🚀 Victory condition met! Triggering playVictoryChime()...");
        playVictoryChime();
        isVictorySoundPlayed = true;
    }
}

function scrambleBoardByDifficulty(tierName) {
    if (typeof puzzleLibrary === 'undefined' || !Array.isArray(puzzleLibrary)) {
        console.error("Error: puzzleLibrary array from puzzle_library_final.js not detected.");
        alert("Puzzle library file missing or not loaded yet!");
        return;
    }

    const bounds = SCHRAMBLE_PRESETS[tierName];
    if (!bounds) return;

    const randomIndex = Math.floor(Math.random() * (bounds.maxIndex - bounds.minIndex + 1)) + bounds.minIndex;
    const targetScramble = puzzleLibrary[randomIndex];

    console.log(`Loading ${tierName} puzzle at Library Index [${randomIndex}]:`, targetScramble);
    applyLibraryState(targetScramble);
}
// 1. Define your emoji library at the top of your file (or right above renderBoard)
const animalEmojis = {
    0: "🐞", // RED: Lady Beetle
    1: "🦊", // ORANGE: Fox
    2: "🐥", // YELLOW: Front-Facing Baby Chick
    3: "🥶", // BLUE: Cold Face
    4: "🐢", // GREEN: Turtle
    5: "😈", // PURPLE: Smiling Face with Horns
    6: "🐺"  // GRAY: Wolf Face
    // 7 is skipped because it represents the empty/blank tile slot
};

function applyLibraryState(libraryEntry) {
    let rawStateArray = [];

    if (Array.isArray(libraryEntry)) {
        rawStateArray = libraryEntry;
    } else if (typeof libraryEntry === 'string') {
        rawStateArray = libraryEntry.replace(/[\[\]]/g, '').split(/[\s,]+/);
    }

    boardState = rawStateArray.map(val => parseInt(val, 10));
    renderBoard();
}

function renderBoard() {
    boardState.forEach((characterId, currentTileIndex) => {
        const targetTile = document.querySelector(`[data-tile-id="${currentTileIndex}"]`);
        if (!targetTile) return;
        const slot = targetTile.querySelector('.character-slot');
        if (!slot) return;

        slot.innerHTML = "";
        slot.classList.remove('at-home');

        if (currentTileIndex === 7) {
            targetTile.className = "tile tile-empty";
        } else {
            targetTile.className = `tile tile-${currentTileIndex + 1}`;
        }

        // If it's not the empty slot ID
        if (characterId !== 7) {
            // Check if we have an emoji mapped to this character ID
            // Update this line inside your renderBoard function:
            if (animalEmojis[characterId] !== undefined) {
                // We added the 'emoji-text' class and removed the hardcoded font-size
                slot.innerHTML = `<span class="emoji-text" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; user-select: none;">${animalEmojis[characterId]}</span>`;
            } else {
                // Fallback to the raw ID number if an emoji isn't found
                slot.innerText = characterId;
            }

            if (characterId === currentTileIndex) {
                slot.classList.add('at-home');
            }
        }
    });
}

// ==========================================
// 4. INPUT, GESTURE, & SWIPE LAYERS
// ==========================================
function initializeMovementEngine() {
    let startX = 0;
    let startY = 0;
    let startTileIndex = null;
    const swipeThreshold = 30;

    const gridContainer = document.getElementById('game-grid');
    if (!gridContainer) return;

    gridContainer.addEventListener('touchstart', (e) => {
        // ⚡️ SAFE AUDIO CATCH: Wake up the web audio engine on touch start
        initGlobalAudioContext();

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
            // ⚡️ SAFE AUDIO CATCH: Wake up context on clicks
            initGlobalAudioContext();

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
        const tempSlide = boardState[emptyIndex];
        boardState[emptyIndex] = boardState[tileIndex];
        boardState[tileIndex] = tempSlide;

        const neighborsToSwap = getNeighborsToSwap(tileIndex, emptyIndex);
        if (neighborsToSwap.length === 2) {
            const [idxA, idxB] = neighborsToSwap;
            const tempSwap = boardState[idxA];
            boardState[idxA] = boardState[idxB];
            boardState[idxB] = tempSwap;
        }

        // Fired instantly through our shared context
        playSwipeSound();

        renderBoard();
        updateJewelTrack();
    }
}

function findSolutionFromLibrary() {
    if (typeof puzzleLibrary === 'undefined' || !Array.isArray(puzzleLibrary)) {
        console.error("puzzleLibrary is not loaded.");
        return [];
    }

    const currentBoardStr = boardState.join(',');

    for (let i = 0; i < puzzleLibrary.length; i++) {
        let rawEntry = puzzleLibrary[i];
        let entryArray = [];

        if (Array.isArray(rawEntry)) {
            entryArray = rawEntry.map(Number);
        } else if (typeof rawEntry === 'string') {
            entryArray = rawEntry.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number);
        }

        const entryLayoutStr = entryArray.slice(0, 8).join(',');

        if (currentBoardStr === entryLayoutStr) {
            return entryArray.slice(8);
        }
    }
    return [];
}

function getNeighborsToSwap(fromIndex, emptyIndex) {
    const masterGraph = {
        0: [1, 4, 3],
        1: [0, 2, 5],
        2: [1, 3, 6],
        3: [2, 7, 0],
        4: [5, 0, 7],
        5: [4, 6, 1],
        6: [5, 7, 2],
        7: [6, 3, 4]
    };
    const allPaths = masterGraph[fromIndex];
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
    let maxIdx = 107;

    if (modeName === 'Medium') { minIdx = 108; maxIdx = 888; }
    else if (modeName === 'Hard') { minIdx = 889; maxIdx = puzzleLibrary.length - 1; }

    const randomIndex = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx;
    const targetScramble = puzzleLibrary[randomIndex];

    let rawArray = [];
    if (Array.isArray(targetScramble)) {
        rawArray = targetScramble.map(Number);
    } else if (typeof targetScramble === 'string') {
        rawArray = targetScramble.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number);
    }

    activeSolutionSteps = rawArray.slice(8);
    const finalScrambledState = rawArray.slice(0, 8);

    moveCount = 0;
    // Replace: isSolutionVisible = false;
    eyeMode = 2; // Set default back to Fully Blind (state 2) on new scramble

    const eyeButton = document.getElementById('btn-eye-solution');
    if (eyeButton) {
        // Clear old state tracking classes and apply state-blind
        eyeButton.classList.remove('state-open', 'state-closed');
        eyeButton.classList.add('state-blind');
    }

    document.getElementById('menu-overlay').classList.remove('active');

    const boardContainer = document.getElementById('board-container');
    if (boardContainer) boardContainer.style.pointerEvents = 'none';

    let durationCounter = 0;
    const totalAnimationTime = 2500;
    const frameIntervalTime = 250;

    const shuffleInterval = setInterval(() => {
        let chaoticState = [];
        while (chaoticState.length < 8) {
            let randomId = Math.floor(Math.random() * 8);
            if (!chaoticState.includes(randomId)) {
                chaoticState.push(randomId);
            }
        }

        boardState = chaoticState;
        renderBoard();

        durationCounter += frameIntervalTime;

        if (durationCounter >= totalAnimationTime) {
            clearInterval(shuffleInterval);
            boardState = finalScrambledState;
            renderBoard();
            updateJewelTrack();

            if (boardContainer) boardContainer.style.pointerEvents = 'auto';
            console.log("Shuffle complete. Real puzzle loaded.");
        }
    }, frameIntervalTime);
}

// ==========================================
// 5. DOM INTERACTION & INTERFACES SETUP
// ==========================================
let isFirstLaunch = true;
window.addEventListener('DOMContentLoaded', () => {
    let isMusicMuted = localStorage.getItem('musicMuted') === 'false';

    const soundOnSvg = document.getElementById('svg-sound-on');
    const soundOffSvg = document.getElementById('svg-sound-off');
    const audioToggleBtn = document.getElementById('btn-audio-toggle');

    if (isMusicMuted) {
        soundOnSvg.style.display = 'none';
        soundOffSvg.style.display = 'block';
        if (typeof bgAudio !== 'undefined') {
            bgAudio.volume = 0;
        }
    } else {
        soundOnSvg.style.display = 'block';
        soundOffSvg.style.display = 'none';
        if (typeof bgAudio !== 'undefined') {
            bgAudio.volume = 0.15;
        }
    }

    audioToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // ⚡️ INITIALIZE ON BUTTON PRESS
        initGlobalAudioContext();

        isMusicMuted = !isMusicMuted;
        localStorage.setItem('musicMuted', isMusicMuted);

        if (isMusicMuted) {
            soundOnSvg.style.display = 'none';
            soundOffSvg.style.display = 'block';
            if (typeof bgAudio !== 'undefined') {
                bgAudio.volume = 0;
            }
            console.log("Background music tracks muted.");
        } else {
            soundOnSvg.style.display = 'block';
            soundOffSvg.style.display = 'none';
            if (typeof bgAudio !== 'undefined') {
                bgAudio.volume = 0.15;
            }

            if (typeof playGameMusic === 'function') {
                playGameMusic();
            }
            console.log("Background music tracks unmuted.");
        }
    });

    renderBoard();
    initializeMovementEngine();

    const overlay = document.getElementById('menu-overlay');


    if (isFirstLaunch) {
        overlay.classList.add('active');

    }

    const eyeButton = document.getElementById('btn-eye-solution');
    eyeButton.addEventListener('click', () => {
        initGlobalAudioContext();

        // Cycles backward: 2 (Blind) -> 1 (Closed) -> 0 (Open) -> 2 (Blind)...
        eyeMode = (eyeMode - 1 + 3) % 3;

        // Clean up classes and apply the current active layout state class
        eyeButton.classList.remove('state-open', 'state-closed', 'state-blind');

        if (eyeMode === 2) {
            eyeButton.classList.add('state-blind');
        } else if (eyeMode === 1) {
            eyeButton.classList.add('state-closed');
        } else if (eyeMode === 0) {
            eyeButton.classList.add('state-open');
        }

        updateJewelTrack();
    });

    document.getElementById('btn-menu-trigger').addEventListener('click', () => {
        initGlobalAudioContext();
        isVictorySoundPlayed = false;
        playGameMusic();
        overlay.classList.add('active');
    });





    document.getElementById('menu-btn-info').addEventListener('click', () => {
        initGlobalAudioContext();
        console.log("Rules modal route opened.");
    });

    document.getElementById('scramble-easy').addEventListener('click', () => {
        initGlobalAudioContext();
        isVictorySoundPlayed = false;
        playGameMusic();
        triggerDifficultySelection('Easy');
    });

    document.getElementById('scramble-medium').addEventListener('click', () => {
        initGlobalAudioContext();
        isVictorySoundPlayed = false;
        playGameMusic();
        triggerDifficultySelection('Medium');
    });

    document.getElementById('scramble-hard').addEventListener('click', () => {
        initGlobalAudioContext();
        isVictorySoundPlayed = false;
        playGameMusic();
        triggerDifficultySelection('Hard');
    });

    const customRulesOverlay = document.getElementById('custom-rules-overlay');
    const infoButtonTrigger = document.getElementById('menu-btn-info');
    const closeRulesTrigger = document.getElementById('btn-custom-rules-close');

    if (infoButtonTrigger) {
        infoButtonTrigger.addEventListener('click', () => {
            initGlobalAudioContext();
            if (customRulesOverlay) {
                customRulesOverlay.style.display = 'block';
            }
        });
    }

    if (closeRulesTrigger) {
        closeRulesTrigger.addEventListener('click', () => {
            if (customRulesOverlay) {
                customRulesOverlay.style.display = 'none';
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    if (customRulesOverlay) {
        customRulesOverlay.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});
// 📱 NATIVE WEB VISIBILITY LISTENER
// Works perfectly in Capacitor without any imports or bundlers
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // App is minimized / user hit back (<) or home button
        bgAudio.pause();
        
        if (globalAudioCtx && globalAudioCtx.state === 'running') {
            globalAudioCtx.suspend();
        }
        console.log("App hidden: Audio paused.");
    } else {
        // App is brought back to the foreground
        if (isMusicPlaying) {
            bgAudio.play().catch(err => console.log("Audio play prevented:", err));
        }
        
        if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
            globalAudioCtx.resume();
        }
        console.log("App visible: Audio restored.");
    }
});
