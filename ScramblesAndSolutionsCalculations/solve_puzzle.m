% =========================================================================
% Slide 'n Swap Master Breadth-First Search Solver Engine (Optimized 2x4)
% =========================================================================
clear; clc;

% 1. Load the 24 global transition matrices into workspace memory
fprintf("Loading transformation matrices from library...\n");
transMat;

% 2. Initialize the Winning Target Goal
goal_state = 1234567; % Mathematically identical to 01234567

% 3. Set up the starting puzzle layout (Your Scramble input)
%start_state = 01276543; -easy one step puzzle
%start_state = 01267534; -another easy one step puzzle
%start_state = 31726540; -a two step process to solve the puzzle
%start_state = 01534276; -a 3 step solution
%start_state = 61245370; -a 7 step solution
%start_state = 42053176;  Failure
%start_state = 04265173;
%start_state = 15642370;
start_state = 61245370;

% If we are already at the goal, exit immediately!
if start_state == goal_state
    disp("The board is already solved!");
    return;
endif

% 4. Pre-allocate the downsized FIFO Queue (1400 rows x 21 columns)
% Col 1 = State Integer, Cols 2-21 = Path History (Max 20 moves)
max_states = 1400;
max_moves = 20;
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
    % Sum only the -1 entries, then add your max_moves limit (20)
    history_row = queue(head, 2:21);
    moves_made = max_moves + sum(history_row(history_row == -1));
    next_history_col = 2 + moves_made;

    % Branch out: Cycle through the 3 valid physics moves
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

        % Multiply the vector by the transformation matrix
        New_V = T * V;

        % Pack the resulting vector back into a pure integer state
        new_state = pack_state_math(New_V);

        % Check if this new state lands exactly on our winning goal
        if new_state == goal_state
            % VICTORY! Record the winning queue row data and stop searching
            queue(tail, 1) = new_state;
            queue(tail, 2:21) = history_row;
            queue(tail, next_history_col) = move_id; % Stamp your official ID!
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
            queue(tail, 2:21) = history_row;
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

%The following 24 slide/swap transformation matrices are defined below:
%ID = 0 corresponds to T1_0
%ID = 1 corresponds to T3_0
%ID = 2 corresponds to T4_0
%ID = 3 corresponds to T0_1
%ID = 4 corresponds to T2_1
%ID = 5 corresponds to T5_1
%ID = 6 corresponds to T1_2
%ID = 7 corresponds to T3_2
%ID = 8 corresponds to T6_2
%ID = 9 corresponds to T2_3
%ID = 10 corresponds to T0_3
%ID = 11 corresponds to T7_3
%ID = 12 corresponds to T5_4
%ID = 13 corresponds to T7_4
%ID = 14 corresponds to T0_4
%ID = 15 corresponds to T4_5
%ID = 16 corresponds to T6_5
%ID = 17 corresponds to T1_5
%ID = 18 corresponds to T5_6
%ID = 19 corresponds to T7_6
%ID = 20 corresponds to T2_6
%ID = 21 corresponds to T3_7
%ID = 22 corresponds to T6_7
%ID = 23 corresponds to T4_7

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

    disp("Raw Queue Row Data (Col 1 = Solved State, Cols 2-21 = Move Path / -1 Sentinels):");
    disp(raw_solution_row);
else
    fprintf("FAILURE. Head pointer reached tail (searched %d states).\n", head);
    disp("No solution exists. Check your board parity or transformation matrices.");
endif

%reconstruct the solution based on which number character to slide in each move
start_state;
tempVector = unpack_state_math(start_state);
move_solution_index=-1;
move_solution_values=-ones(1,20);
for i=1:20
switch queue(solution_row,i+1) %first entry in queue is the initial state. That's why +1 added to i. The remaining entries contain the tranformation matrix IDs.
            case 0; move_solution_index =1+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T1_0*tempVector; %Add 1 to account that array starts counting at 1, not 0
            case 1; move_solution_index =3+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T3_0*tempVector;
            case 2; move_solution_index =4+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T4_0*tempVector;
            case 3; move_solution_index =0+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T0_1*tempVector;
            case 4; move_solution_index =2+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T2_1*tempVector;
            case 5; move_solution_index =5+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T5_1*tempVector;
            case 6; move_solution_index =1+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T1_2*tempVector;
            case 7; move_solution_index =3+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T3_2*tempVector;
            case 8; move_solution_index =6+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T6_2*tempVector;
            case 9; move_solution_index =2+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T2_3*tempVector;
            case 10; move_solution_index =0+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T0_3*tempVector;
            case 11; move_solution_index =7+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T7_3*tempVector;
            case 12; move_solution_index =5+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T5_4*tempVector;
            case 13; move_solution_index =7+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T7_4*tempVector;
            case 14; move_solution_index =0+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T0_4*tempVector;
            case 15; move_solution_index =4+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T4_5*tempVector;
            case 16; move_solution_index =6+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T6_5*tempVector;
            case 17; move_solution_index =1+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T1_5*tempVector;
            case 18; move_solution_index =5+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T5_6*tempVector;
            case 19; move_solution_index =7+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T7_6*tempVector;
            case 20; move_solution_index =2+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T2_6*tempVector;
            case 21; move_solution_index =3+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T3_7*tempVector;
            case 22; move_solution_index =6+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T6_7*tempVector;
            case 23; move_solution_index =4+1; move_solution_values(1,i) = tempVector(move_solution_index,1); tempVector=T4_7*tempVector;

        endswitch

endfor

INPUT = start_state
OUTPUT = unpack_state_math(start_state)';
OUTPUT = [OUTPUT,move_solution_values]

fprintf("=========================================\n");
