function state_num = pack_state_math(vec)
    state_num = 0;
    for pos = 0:7
        digit = vec(pos + 1);
        power_exponent = 7 - pos;
        state_num = state_num + digit * (10 ^ power_exponent);
    endfor
endfunction
