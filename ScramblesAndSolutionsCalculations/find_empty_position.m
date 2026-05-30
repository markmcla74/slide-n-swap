function empty_pos = find_empty_position(state_num)
    % Initialize our tracking variable
    current_num = state_num;
    empty_pos = -1; % Sentinel value in case 7 isn't found

    % Force exactly 8 steps running backward from board position 7 down to 0.
    % This cleanly catches the '7' even if the state has an invisible leading zero!
    for pos = 7:-1:0
        % Isolate the rightmost digit using modulo 10
        digit = mod(current_num, 10);

        % If this digit matches our empty space (7), we've found it!
        if digit == 7
            empty_pos = pos;
            return; % Exit the function immediately with the 0-indexed position
        endif

        % Shift the integer to the right to check the next digit on the next turn
        current_num = floor(current_num / 10);
    endfor
endfunction
