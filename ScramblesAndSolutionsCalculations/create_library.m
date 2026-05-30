% =========================================================================
% Slide 'n Swap Global Library Generator (Forward Permutation Loop)
% =========================================================================
clear; clc;

fprintf("Loading transformation matrices from library...\n");
transMat;

goal_state = 1234567;

% 1. Generate all permutations of the 8 slots (0 through 7)
% This creates a massive matrix where each row is a unique layout
fprintf("Generating permutation matrix...\n");
base_elements = [0, 1, 2, 3, 4, 5, 6, 7];
all_perms = perms(base_elements); % 40,320 rows x 8 columns

output_filename = "puzzle_library.txt";
fid = fopen(output_filename, 'w');
fprintf(fid, "const puzzleLibrary = [\n");

total_saved_states = 0;

fprintf("Processing permutations forward... This may take a few minutes.\n\n");

% 2. Loop through every single permutation row
for p = 1:length(all_perms)
    % Unpack the current permutation row from the matrix
    current_row = all_perms(p, :);

    % Pack it into your standard state integer
    % (e.g., [6, 1, 2, 4, 5, 3, 7, 0] becomes 61245370)
    start_state = pack_state_math(current_row');

    % Skip the goal state itself, we don't need a path for it!
    if start_state == goal_state
        continue;
    endif

    % --- RUN YOUR EXACT SOLVE_PUZZLE LOGIC HERE ---
    max_states = 1400;
    max_moves = 20;
    queue = -ones(max_states, 1 + max_moves);
    queue(1, 1) = start_state;

    head = 1;
    tail = 2;

    visited = -ones(max_states, 1);
    visited(1) = start_state;

    solution_row = -1;

    % Run BFS forward to find the goal
    while head < tail
        current_state = queue(head, 1);
        empty_slot = find_empty_position(current_state);
        V = unpack_state_math(current_state);

        history_row = queue(head, 2:21);
        moves_made = max_moves + sum(history_row(history_row == -1));
        next_history_col = 2 + moves_made;

        for m = empty_slot:(empty_slot+2)
            switch empty_slot
                case 0; if (m==empty_slot) T = T1_0; move_id = 0; elseif (m==empty_slot+1) T = T3_0; move_id = 1; else T = T4_0; move_id = 2; endif
                case 1; if (m==empty_slot) T = T0_1; move_id = 3; elseif (m==empty_slot+1) T = T2_1; move_id = 4; else T = T5_1; move_id = 5; endif
                case 2; if (m==empty_slot) T = T1_2; move_id = 6; elseif (m==empty_slot+1) T = T3_2; move_id = 7; else T = T6_2; move_id = 8; endif
                case 3; if (m==empty_slot) T = T2_3; move_id = 9; elseif (m==empty_slot+1) T = T0_3; move_id = 10; else T = T7_3; move_id = 11; endif
                case 4; if (m==empty_slot) T = T5_4; move_id = 12; elseif (m==empty_slot+1) T = T7_4; move_id = 13; else T = T0_4; move_id = 14; endif
                case 5; if (m==empty_slot) T = T4_5; move_id = 15; elseif (m==empty_slot+1) T = T6_5; move_id = 16; else T = T1_5; move_id = 17; endif
                case 6; if (m==empty_slot) T = T5_6; move_id = 18; elseif (m==empty_slot+1) T = T7_6; move_id = 19; else T = T2_6; move_id = 20; endif
                case 7; if (m==empty_slot) T = T3_7; move_id = 21; elseif (m==empty_slot+1) T = T6_7; move_id = 22; else T = T4_7; move_id = 23; endif
            endswitch

            New_V = T * V;
            new_state = pack_state_math(New_V);

            if new_state == goal_state
                queue(tail, 1) = new_state;
                queue(tail, 2:21) = history_row;
                queue(tail, next_history_col) = move_id;
                solution_row = tail;
                break;
            endif

            if ~any(visited(1:tail-1) == new_state)
                visited(tail) = new_state;
                queue(tail, 1) = new_state;
                queue(tail, 2:21) = history_row;
                queue(tail, next_history_col) = move_id;
                tail = tail + 1;
            endif
        endfor

        if solution_row ~= -1
            break;
        endif
        head = head + 1;
    endwhile

    % If a solution was found (meaning it's a valid, solvable state!)
    if solution_row ~= -1
        total_saved_states = total_saved_states + 1;

        % Run YOUR exact character reconstruction logic
        tempVector = unpack_state_math(start_state);
        move_solution_values = -ones(1, 20);

        for i = 1:20
            switch queue(solution_row, i+1)
                case 0;  idx = 1+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T1_0*tempVector;
                case 1;  idx = 3+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T3_0*tempVector;
                case 2;  idx = 4+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T4_0*tempVector;
                case 3;  idx = 0+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T0_1*tempVector;
                case 4;  idx = 2+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T2_1*tempVector;
                case 5;  idx = 5+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T5_1*tempVector;
                case 6;  idx = 1+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T1_2*tempVector;
                case 7;  idx = 3+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T3_2*tempVector;
                case 8;  idx = 6+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T6_2*tempVector;
                case 9;  idx = 2+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T2_3*tempVector;
                case 10; idx = 0+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T0_3*tempVector;
                case 11; idx = 7+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T7_3*tempVector;
                case 12; idx = 5+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T5_4*tempVector;
                case 13; idx = 7+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T7_4*tempVector;
                case 14; idx = 0+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T0_4*tempVector;
                case 15; idx = 4+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T4_5*tempVector;
                case 16; idx = 6+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T6_5*tempVector;
                case 17; idx = 1+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T1_5*tempVector;
                case 18; idx = 5+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T5_6*tempVector;
                case 19; idx = 7+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T7_6*tempVector;
                case 20; idx = 2+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T2_6*tempVector;
                case 21; idx = 3+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T3_7*tempVector;
                case 22; idx = 6+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T6_7*tempVector;
                case 23; idx = 4+1; move_solution_values(1,i) = tempVector(idx,1); tempVector=T4_7*tempVector;
            endswitch
        endfor

        % Write the row exactly as you planned: 8 state digits, 20 move values
        state_vector = unpack_state_math(start_state)';
        full_row_data = [state_vector, move_solution_values];

        fprintf(fid, "    [ ");
        for c = 1:8
            fprintf(fid, "%d, ", full_row_data(c));
        endfor
        for c = 9:27
            fprintf(fid, "%2d, ", full_row_data(c));
        endfor
        fprintf(fid, "%2d ],\n", full_row_data(28));
    endif

    % Small progress monitor so you aren't staring at a blank screen
    if mod(p, 5000) == 0
        fprintf("Processed %d / 40320 permutations...\n", p);
    endif
endfor

fprintf(fid, "];\n");
fclose(fid);

fprintf("\nDone! Valid states written: %d\n", total_saved_states);
