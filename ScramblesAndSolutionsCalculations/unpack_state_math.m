function vec = unpack_state_math(state_num)
    vec = zeros(8, 1);
    current_num = state_num;

    for pos = 7:-1:0
        digit = mod(current_num, 10);
        vec(pos + 1) = digit;
        current_num = floor(current_num / 10);
    endfor
endfunction
