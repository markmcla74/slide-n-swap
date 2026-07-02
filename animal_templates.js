// Complete 7-character asset library with front-facing, high-contrast vector graphics
const animalTemplates = {
    0: `<svg class="animal-svg" viewBox="0 0 100 100">
    <path d="M 20,40 Q 10,25 22,15 Q 35,15 30,35" fill="#ff6b81" stroke="#000" stroke-width="3.5"/>
    <path d="M 80,40 Q 90,25 78,15 Q 65,15 70,35" fill="#ff6b81" stroke="#000" stroke-width="3.5"/>
    <ellipse cx="50" cy="55" rx="25" ry="18" fill="#ff3838" stroke="#000" stroke-width="4"/>
    <circle cx="38" cy="35" r="5" fill="#fff" stroke="#000" stroke-width="2"/>
    <circle cx="38" cy="35" r="2" fill="#000"/>
    <circle cx="62" cy="35" r="5" fill="#fff" stroke="#000" stroke-width="2"/>
    <circle cx="62" cy="35" r="2" fill="#000"/>
    <path d="M 42,62 Q 50,68 58,62" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    1: `<svg class="animal-svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="25" fill="#e67e22" stroke="#000" stroke-width="4"/>
    <path d="M 30,55 Q 38,42 50,45 Q 62,42 70,55 Q 50,72 30,55 Z" fill="#fff5e6" stroke="#000" stroke-width="2"/>
    <circle cx="30" cy="28" r="8" fill="#e67e22" stroke="#000" stroke-width="3.5"/>
    <circle cx="30" cy="28" r="4" fill="#ffb3ba"/>
    <circle cx="70" cy="28" r="8" fill="#e67e22" stroke="#000" stroke-width="3.5"/>
    <circle cx="70" cy="28" r="4" fill="#ffb3ba"/>
    <path d="M 27,45 L 37,47 M 27,53 L 34,54 M 73,45 L 63,47 M 73,53 L 66,54 M 50,27 L 50,36" fill="none" stroke="#2c3e50" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="40" cy="42" r="3.5" fill="#000"/>
    <circle cx="60" cy="42" r="3.5" fill="#000"/>
    <polygon points="46,50 54,50 50,55" fill="#e74c3c" stroke="#000" stroke-width="1.5"/>
    <path d="M 45,60 Q 50,56 55,60" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    2: `<svg class="animal-svg" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="24" fill="#ffea00" stroke="#000" stroke-width="4"/>
    <path d="M 26,55 Q 16,50 26,42" fill="#ff9100" stroke="#000" stroke-width="2.5"/>
    <path d="M 74,55 Q 84,50 74,42" fill="#ff9100" stroke="#000" stroke-width="2.5"/>
    <circle cx="40" cy="46" r="3.5" fill="#000"/>
    <circle cx="60" cy="46" r="3.5" fill="#000"/>
    <polygon points="44,53 56,53 50,62" fill="#ff6a00" stroke="#000" stroke-width="3"/>
    </svg>`,

    3: `<svg class="animal-svg" viewBox="0 0 100 100">
    <path d="M 34,26 Q 30,12 24,16 Z" fill="#fff5e6" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 66,26 Q 70,12 76,16 Z" fill="#fff5e6" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="22" cy="38" rx="10" ry="6" fill="#54a0ff" stroke="#000" stroke-width="3.5" transform="rotate(-20 22 38)"/>
    <ellipse cx="22" cy="38" rx="6" ry="3.5" fill="#ffb3ba" transform="rotate(-20 22 38)"/>
    <ellipse cx="78" cy="38" rx="10" ry="6" fill="#54a0ff" stroke="#000" stroke-width="3.5" transform="rotate(20 78 38)"/>
    <ellipse cx="78" cy="38" rx="6" ry="3.5" fill="#ffb3ba" transform="rotate(20 78 38)"/>
    <path d="M 32,30 L 68,30 Q 74,30 74,40 L 72,56 Q 72,66 64,66 L 36,66 Q 28,66 28,56 L 26,40 Q 26,30 32,30 Z" fill="#74b9ff" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="50" cy="56" rx="19" ry="11" fill="#ffccd5" stroke="#000" stroke-width="3"/>
    <circle cx="43" cy="54" r="2.5" fill="#c87888"/>
    <circle cx="57" cy="54" r="2.5" fill="#c87888"/>
    <path d="M 36,40 Q 42,35 44,41" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>
    <path d="M 64,40 Q 58,35 56,41" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>
    <path d="M 46,62 Q 50,65 54,62" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

   4: `<svg class="animal-svg" viewBox="0 0 100 100">
    <path d="M 38,32 Q 25,18 28,12" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="28" cy="12" r="4.5" fill="#ff007f" stroke="#000" stroke-width="2"/>
    <path d="M 62,32 Q 75,18 72,12" fill="none" stroke="#000" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="72" cy="12" r="4.5" fill="#ff007f" stroke="#000" stroke-width="2"/>
    <path d="M 50,26 C 28,26 26,45 34,58 C 40,68 50,70 50,70 C 50,70 60,68 66,58 C 74,45 72,26 50,26 Z" fill="#38b000" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="38" cy="46" rx="7" ry="11" fill="#111" stroke="#000" stroke-width="1.5" transform="rotate(12 38 46)"/>
    <circle cx="36" cy="42" r="2.2" fill="#fff" stroke="none"/>
    <circle cx="39" cy="48" r="0.8" fill="#fff" stroke="none"/>
    <ellipse cx="62" cy="46" rx="7" ry="11" fill="#111" stroke="#000" stroke-width="1.5" transform="rotate(-12 62 46)"/>
    <circle cx="64" cy="42" r="2.2" fill="#fff" stroke="none"/>
    <circle cx="61" cy="48" r="0.8" fill="#fff" stroke="none"/>
    <path d="M 45,59 Q 50,63 55,59" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    5: `<svg class="animal-svg" viewBox="0 0 100 100">
    <path d="M 50,22 C 32,22 32,48 32,54 C 32,60 38,60 42,54 C 46,48 48,60 52,60 C 56,60 58,48 62,54 C 66,60 72,60 72,54 C 72,48 68,22 50,22 Z" fill="#8e44ad" stroke="#000" stroke-width="4"/>
    <circle cx="36" cy="62" r="2.5" fill="#d291bc" stroke="#000" stroke-width="1.5"/>
    <circle cx="50" cy="64" r="2.5" fill="#d291bc" stroke="#000" stroke-width="1.5"/>
    <circle cx="64" cy="62" r="2.5" fill="#d291bc" stroke="#000" stroke-width="1.5"/>
    <circle cx="42" cy="40" r="3.5" fill="#000"/>
    <circle cx="58" cy="40" r="3.5" fill="#000"/>
    <ellipse cx="50" cy="48" rx="3" ry="2" fill="none" stroke="#000" stroke-width="2"/>
    </svg>`,

    6: `<svg class="animal-svg" viewBox="0 0 100 100">
    <ellipse cx="26" cy="50" rx="7" ry="16" fill="#00cca8" stroke="#000" stroke-width="3.5" transform="rotate(15 26 50)"/>
    <ellipse cx="74" cy="50" rx="7" ry="16" fill="#00cca8" stroke="#000" stroke-width="3.5" transform="rotate(-15 74 50)"/>
    <circle cx="50" cy="46" r="23" fill="#00f5d4" stroke="#000" stroke-width="4"/>
    <ellipse cx="50" cy="56" rx="13" ry="9" fill="#fbfcf7" stroke="#000" stroke-width="2.5"/>
    <circle cx="41" cy="40" r="3.5" fill="#000"/>
    <circle cx="59" cy="40" r="3.5" fill="#000"/>
    <ellipse cx="50" cy="51" rx="4" ry="2.5" fill="#000"/>
    <path d="M 50,53 L 50,58 M 46,59 Q 50,62 54,59" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    7: "" // Blank space represents the empty white tile frame
};
