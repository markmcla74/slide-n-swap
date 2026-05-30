% =========================================================================
% Slide 'n Swap Master Breadth-First Search Solver Engine (Website 3D Cube)
% =========================================================================
clear; clc;

% 1. Dynamically generate the 24 3D Cube transformation matrices
fprintf("Generating website cube topology transformation matrices...\n");

% Define the 3 neighboring slots for each empty position (0-indexed)
% Graph mapping: 0-3 = Outer Square (TL, TR, BL, BR), 4-7 = Inner Square (TL, TR, BL, BR)
neighbors = cell(8, 1);
neighbors{1} = [1, 2, 4]; % Slot 0 connects to 1, 2, 4
neighbors{2} = [0, 3, 5]; % Slot 1 connects to 0, 3, 5
neighbors{3} = [0, 3, 6]; % Slot 2 connects to 0, 3, 6
neighbors{4} = [1, 2, 7]; % Slot 3 connects to 1, 2, 7
neighbors{5} = [5, 6, 0]; % Slot 4 connects to 5, 6, 0
neighbors{6} = [4, 7, 1]; % Slot 5 connects to 4, 7, 1
neighbors{7} = [4, 7, 2]; % Slot 6 connects to 4, 7, 2
neighbors{8} = [5, 6, 3]; % Slot 7 connects to 5, 6, 3

cube_trans_mats = zeros(8, 8, 24);
matrix_counter = 1;

for blank_slot = 0:7
    current_neighbors = neighbors{blank_slot + 1};
    for m = 1:3
        neighbor_slot = current_neighbors(m);
        T = eye(8);

        % Convert 0-based slots to Octave's 1-based indices
        idx1 = blank_slot + 1;
        idx2 = neighbor_slot + 1;

        % Set up the single swap pairs
        T(idx1, idx1) = 0;
        T(idx2, idx2) = 0;
        T(idx1, idx2) = 1;
        T(idx2, idx1) = 1;

        cube_trans_mats(:, :, matrix_counter) = T;
        matrix_counter = matrix_counter + 1;
    end
end

% 2. Initialize the Winning Target Goal
goal_state = 1234567; % Mathematically identical to 01234567

% 3. Set up the starting puzzle layout (Your Scramble input)
% NOTE: Enter the website values exactly as they appear on the website positions 0-7,
% after subtracting one from each value so they range from 0 to 7.
start_state = 53271846;

% If we are already at the goal, exit immediately!
if start_state == goal_state
    disp("The board is already solved!");
    return;
endif

% 4. Pre-allocate the expanded FIFO Queue (20200 rows x 31 columns)
% Col 1 = State Integer, Cols 2-31 = Path History (Max 30 moves)
max_states = 20200;
max_moves = 30;
queue = -ones(max_states, 1 + max_moves);

% Seed the very first row with our starting layout
queue(1, 1) = start_state;

% Initialize the FIFO pointers (Octave uses 1-based indexing)
head = 1;
tail = 2;

% 5. Initialize the Visited Registry Array
visited = -ones(max_states, 1);
visited(1) = start_state;

fprintf("Engine initialized. Hunting for the optimal path...\n\n");
solution_row = -1;

% =========================================================================
% MAIN SEARCH LOOP
% =========================================================================
while head < tail
    % Grab the current state integer from the front of the conveyor belt
    current_state = queue(head, 1);

    % Find out where the empty space '7' is mathematically hiding
    empty_slot = find_empty_position(current_state);

    % Unpack the current state integer into a pure 8x1 vector for matrix multiplication
    V = unpack_state_math(current_state);

    % Find how many moves have been made so far in this specific history track.
    history_row = queue(head, 2:31);
    moves_made = max_moves + sum(history_row(history_row == -1));
    next_history_col = 2 + moves_made;

    % Branch out: Cycle through the 3 valid transformation matrices for this slot location
    base_matrix_idx = empty_slot * 3;

    for m = 1:3
        % Calculate global matrix index and move ID
        matrix_idx = base_matrix_idx + m;
        move_id = matrix_idx - 1; % 0-indexed ID for tracing paths

        T = cube_trans_mats(:, :, matrix_idx);

        % Multiply the vector by the transformation matrix
        New_V = T * V;

        % Pack the resulting vector back into a pure integer state
        new_state = pack_state_math(New_V);

        % Check if this new state lands exactly on our winning goal
        if new_state == goal_state
            % VICTORY! Record the winning queue row data and stop searching
            queue(tail, 1) = new_state;
            queue(tail, 2:31) = history_row;
            queue(tail, next_history_col) = move_id;
            solution_row = tail;
            visited(tail) = new_state;
        endif

        if ((new_state != goal_state) && solution_row == -1)
          % If we have NOT seen this layout before, process and save it
          if ~any(visited(1:tail-1) == new_state)
            % Mark it as visited inside our plain array registry
            visited(tail) = new_state;

            % Push the brand new node to the back of the queue matrix
            queue(tail, 1) = new_state;
            queue(tail, 2:31) = history_row;
            queue(tail, next_history_col) = move_id;

            % Bump the tail pointer forward to prepare for the next discovery
            tail = tail + 1;
          endif
        endif

    endfor

    % Check if the victory flag was tripped inside the branching loop
    if solution_row ~= -1
        break;
    endif

    % Work on this node is done! Move the conveyor belt forward
    head = head + 1;
endwhile

% =========================================================================
% DEBUGGING OUTPUT RESULTS
% =========================================================================
fprintf("\n=========================================\n");
fprintf("          ENGINE SEARCH DIAGNOSTICS       \n");
fprintf("=========================================\n");

if solution_row ~= -1
    fprintf("SUCCESS! Winning node found.\n");
    fprintf("Queue Row Index: %d\n\n", solution_row);

    % Extract and display the absolute raw row content from the queue matrix
    raw_solution_row = queue(solution_row, :);

    disp("Raw Queue Row Data (Col 1 = Solved State, Cols 2-31 = Move Path / -1 Sentinels):");
    disp(raw_solution_row);
else
    fprintf("FAILURE. Head pointer reached tail (searched %d states).\n", head);
    disp("No solution exists. Check your board parity or transformation matrices.");
endif
fprintf("=========================================\n");
% =========================================================================
% AUTOMATED TILE-NUMBER CLICK TRANSLATOR
% =========================================================================
if solution_row ~= -1
    fprintf("\n=========================================\n");
    fprintf("       ACTUAL TILE CLICK SEQUENCE        \n");
    fprintf("=========================================\n");

    % 1. Extract the raw move path from the winning row
    raw_path = queue(solution_row, 2:31);
    valid_moves = raw_path(raw_path ~= -1);

    % 2. To know WHICH tile is in a position, we must track the board state
    % starting from your original layout vector
    current_board_vector = unpack_state_math(start_state);

    fprintf("Click these tile numbers in order:\n\n   ");

    for i = 1:length(valid_moves)
        move_id = valid_moves(i);

        % Deconstruct the Move ID to find the moving neighbor slot
        b_slot = floor(move_id / 3);
        m_idx = mod(move_id, 3) + 1;
        target_neighbor_slot = neighbors{b_slot + 1}(m_idx);

        % Convert neighbor slot (0-7) to Octave's 1-based vector index (1-8)
        vector_index_to_click = target_neighbor_slot + 1;

        % Grab the ACTUAL tile number sitting in that position right now
        actual_tile_value = current_board_vector(vector_index_to_click);

        % Print the tile value (no 8s, just the numbers 1-7!)
        if i == length(valid_moves)
            fprintf("%d\n", actual_tile_value);
        else
            fprintf("%d -> ", actual_tile_value);
        endif

        % Advance our tracking board to the next state using the matrix
        T = cube_trans_mats(:, :, move_id + 1);
        current_board_vector = T * current_board_vector;
    endfor
    fprintf("=========================================\n");
endif
