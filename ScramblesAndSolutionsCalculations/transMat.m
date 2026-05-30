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


%Group 0: Slides when Empty Space (pos_7) is at pos_0
%ID = 0 corresponds to T1_0
T1_0 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 1 && j_0 == 0) || (i_0 == 0 && j_0 == 1)
      T1_0(i,j) = 1;
    elseif (i_0 == 2 && j_0 == 5) || (i_0 == 5 && j_0 == 2)
      T1_0(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 1 && i_0 != 0 && i_0 != 2 && i_0 != 5)
      T1_0(i,j) = 1;
    else
      T1_0(i,j) = 0;
    endif
  endfor
endfor

%ID = 1 corresponds to T3_0
T3_0 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 3 && j_0 == 0) || (i_0 == 0 && j_0 == 3)
      T3_0(i,j) = 1;
    elseif (i_0 == 2 && j_0 == 7) || (i_0 == 7 && j_0 == 2)
      T3_0(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 3 && i_0 != 0 && i_0 != 2 && i_0 != 7)
      T3_0(i,j) = 1;
    else
      T3_0(i,j) = 0;
    endif
  endfor
endfor

%ID = 2 corresponds to T4_0
T4_0 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 4 && j_0 == 0) || (i_0 == 0 && j_0 == 4)
      T4_0(i,j) = 1;
    elseif (i_0 == 5 && j_0 == 7) || (i_0 == 7 && j_0 == 5)
      T4_0(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 4 && i_0 != 0 && i_0 != 5 && i_0 != 7)
      T4_0(i,j) = 1;
    else
      T4_0(i,j) = 0;
    endif
  endfor
endfor

%Group 1: Slides when Empty Space (pos_7) is at pos_1
%ID = 3 corresponds to T0_1
T0_1 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 0 && j_0 == 1) || (i_0 == 1 && j_0 == 0)
      T0_1(i,j) = 1;
    elseif (i_0 == 3 && j_0 == 4) || (i_0 == 4 && j_0 == 3)
      T0_1(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 0 && i_0 != 1 && i_0 != 3 && i_0 != 4)
      T0_1(i,j) = 1;
    else
      T0_1(i,j) = 0;
    endif
  endfor
endfor

%ID = 4 corresponds to T2_1
T2_1 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 2 && j_0 == 1) || (i_0 == 1 && j_0 == 2)
      T2_1(i,j) = 1;
    elseif (i_0 == 3 && j_0 == 6) || (i_0 == 6 && j_0 == 3)
      T2_1(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 2 && i_0 != 1 && i_0 != 3 && i_0 != 6)
      T2_1(i,j) = 1;
    else
      T2_1(i,j) = 0;
    endif
  endfor
endfor

%ID = 5 corresponds to T5_1
T5_1 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 5 && j_0 == 1) || (i_0 == 1 && j_0 == 5)
      T5_1(i,j) = 1;
    elseif (i_0 == 4 && j_0 == 6) || (i_0 == 6 && j_0 == 4)
      T5_1(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 5 && i_0 != 1 && i_0 != 4 && i_0 != 6)
      T5_1(i,j) = 1;
    else
      T5_1(i,j) = 0;
    endif
  endfor
endfor

%Group 2: Slides when Empty Space (pos_7) is at pos_2
%ID = 6 corresponds to T1_2
T1_2 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 1 && j_0 == 2) || (i_0 == 2 && j_0 == 1)
      T1_2(i,j) = 1;
    elseif (i_0 == 0 && j_0 == 5) || (i_0 == 5 && j_0 == 0)
      T1_2(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 1 && i_0 != 2 && i_0 != 0 && i_0 != 5)
      T1_2(i,j) = 1;
    else
      T1_2(i,j) = 0;
    endif
  endfor
endfor

%ID = 7 corresponds to T3_2
T3_2 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 3 && j_0 == 2) || (i_0 == 2 && j_0 == 3)
      T3_2(i,j) = 1;
    elseif (i_0 == 0 && j_0 == 7) || (i_0 == 7 && j_0 == 0)
      T3_2(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 3 && i_0 != 2 && i_0 != 0 && i_0 != 7)
      T3_2(i,j) = 1;
    else
      T3_2(i,j) = 0;
    endif
  endfor
endfor

%ID = 8 corresponds to T6_2
T6_2 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 6 && j_0 == 2) || (i_0 == 2 && j_0 == 6)
      T6_2(i,j) = 1;
    elseif (i_0 == 5 && j_0 == 7) || (i_0 == 7 && j_0 == 5)
      T6_2(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 6 && i_0 != 2 && i_0 != 5 && i_0 != 7)
      T6_2(i,j) = 1;
    else
      T6_2(i,j) = 0;
    endif
  endfor
endfor

%Group 3: Slides when Empty Space (pos_7) is at pos_3
%ID = 9 corresponds to T2_3
T2_3 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 2 && j_0 == 3) || (i_0 == 3 && j_0 == 2)
      T2_3(i,j) = 1;
    elseif (i_0 == 1 && j_0 == 6) || (i_0 == 6 && j_0 == 1)
      T2_3(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 2 && i_0 != 3 && i_0 != 1 && i_0 != 6)
      T2_3(i,j) = 1;
    else
      T2_3(i,j) = 0;
    endif
  endfor
endfor

%ID = 10 corresponds to T0_3
T0_3 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 0 && j_0 == 3) || (i_0 == 3 && j_0 == 0)
      T0_3(i,j) = 1;
    elseif (i_0 == 1 && j_0 == 4) || (i_0 == 4 && j_0 == 1)
      T0_3(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 0 && i_0 != 3 && i_0 != 1 && i_0 != 4)
      T0_3(i,j) = 1;
    else
      T0_3(i,j) = 0;
    endif
  endfor
endfor

%ID = 11 corresponds to T7_3
T7_3 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 7 && j_0 == 3) || (i_0 == 3 && j_0 == 7)
      T7_3(i,j) = 1;
    elseif (i_0 == 6 && j_0 == 4) || (i_0 == 4 && j_0 == 6)
      T7_3(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 7 && i_0 != 3 && i_0 != 6 && i_0 != 4)
      T7_3(i,j) = 1;
    else
      T7_3(i,j) = 0;
    endif
  endfor
endfor

%Group 4: Slides when Empty Space (pos_7) is at pos_4
%ID = 12 corresponds to T5_4
T5_4 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 5 && j_0 == 4) || (i_0 == 4 && j_0 == 5)
      T5_4(i,j) = 1;
    elseif (i_0 == 6 && j_0 == 1) || (i_0 == 1 && j_0 == 6)
      T5_4(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 5 && i_0 != 4 && i_0 != 6 && i_0 != 1)
      T5_4(i,j) = 1;
    else
      T5_4(i,j) = 0;
    endif
  endfor
endfor

%ID = 13 corresponds to T7_4
T7_4 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 7 && j_0 == 4) || (i_0 == 4 && j_0 == 7)
      T7_4(i,j) = 1;
    elseif (i_0 == 6 && j_0 == 3) || (i_0 == 3 && j_0 == 6)
      T7_4(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 7 && i_0 != 4 && i_0 != 6 && i_0 != 3)
      T7_4(i,j) = 1;
    else
      T7_4(i,j) = 0;
    endif
  endfor
endfor

%ID = 14 corresponds to T0_4
T0_4 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 0 && j_0 == 4) || (i_0 == 4 && j_0 == 0)
      T0_4(i,j) = 1;
    elseif (i_0 == 3 && j_0 == 1) || (i_0 == 1 && j_0 == 3)
      T0_4(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 0 && i_0 != 4 && i_0 != 3 && i_0 != 1)
      T0_4(i,j) = 1;
    else
      T0_4(i,j) = 0;
    endif
  endfor
endfor

%Group 5: Slides when Empty Space (pos_7) is at pos_5
%ID = 15 corresponds to T4_5
T4_5 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 4 && j_0 == 5) || (i_0 == 5 && j_0 == 4)
      T4_5(i,j) = 1;
    elseif (i_0 == 7 && j_0 == 0) || (i_0 == 0 && j_0 == 7)
      T4_5(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 4 && i_0 != 5 && i_0 != 7 && i_0 != 0)
      T4_5(i,j) = 1;
    else
      T4_5(i,j) = 0;
    endif
  endfor
endfor

%ID = 16 corresponds to T6_5
T6_5 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 6 && j_0 == 5) || (i_0 == 5 && j_0 == 6)
      T6_5(i,j) = 1;
    elseif (i_0 == 7 && j_0 == 2) || (i_0 == 2 && j_0 == 7)
      T6_5(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 6 && i_0 != 5 && i_0 != 7 && i_0 != 2)
      T6_5(i,j) = 1;
    else
      T6_5(i,j) = 0;
    endif
  endfor
endfor

%ID = 17 corresponds to T1_5
T1_5 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 1 && j_0 == 5) || (i_0 == 5 && j_0 == 1)
      T1_5(i,j) = 1;
    elseif (i_0 == 0 && j_0 == 2) || (i_0 == 2 && j_0 == 0)
      T1_5(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 1 && i_0 != 5 && i_0 != 0 && i_0 != 2)
      T1_5(i,j) = 1;
    else
      T1_5(i,j) = 0;
    endif
  endfor
endfor


%Group 6: Slides when Empty Space (pos_7) is at pos_6
%ID = 18 corresponds to T5_6
T5_6 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 5 && j_0 == 6) || (i_0 == 6 && j_0 == 5)
      T5_6(i,j) = 1;
    elseif (i_0 == 4 && j_0 == 1) || (i_0 == 1 && j_0 == 4)
      T5_6(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 5 && i_0 != 6 && i_0 != 4 && i_0 != 1)
      T5_6(i,j) = 1;
    else
      T5_6(i,j) = 0;
    endif
  endfor
endfor

%ID = 19 corresponds to T7_6
T7_6 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 7 && j_0 == 6) || (i_0 == 6 && j_0 == 7)
      T7_6(i,j) = 1;
    elseif (i_0 == 4 && j_0 == 3) || (i_0 == 3 && j_0 == 4)
      T7_6(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 7 && i_0 != 6 && i_0 != 4 && i_0 != 3)
      T7_6(i,j) = 1;
    else
      T7_6(i,j) = 0;
    endif
  endfor
endfor

%ID = 20 corresponds to T2_6
T2_6 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 2 && j_0 == 6) || (i_0 == 6 && j_0 == 2)
      T2_6(i,j) = 1;
    elseif (i_0 == 1 && j_0 == 3) || (i_0 == 3 && j_0 == 1)
      T2_6(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 2 && i_0 != 6 && i_0 != 1 && i_0 != 3)
      T2_6(i,j) = 1;
    else
      T2_6(i,j) = 0;
    endif
  endfor
endfor


%Group 7: Slides when Empty Space (pos_7) is at pos_7
% Pre-allocate the 8x8 matrix with zeros
%ID = 21 corresponds to T3_7
T3_7 = zeros(8, 8);

% Run the loops using your preferred 0-based indexing (0 to 7)
for i_0 = 0:7
  for j_0 = 0:7

    % Convert to Octave's internal 1-based matrix coordinates
    i = i_0 + 1;
    j = j_0 + 1;

    % --- THE SLIDE ---
    % pos_3 and pos_7 swap places
    if (i_0 == 3 && j_0 == 7) || (i_0 == 7 && j_0 == 3)
      T3_7(i,j) = 1;

    % --- THE NEIGHBOR SWAP ---
    % pos_0 and pos_2 swap places
    elseif (i_0 == 0 && j_0 == 2) || (i_0 == 2 && j_0 == 0)
      T3_7(i,j) = 1;

    % --- UNTOUCHED POSITIONS ---
    % pos_1, pos_4, pos_5, and pos_6 stay on the identity diagonal
    elseif (i_0 == j_0 && i_0 != 3 && i_0 != 7 && i_0 != 0 && i_0 != 2)
      T3_7(i,j) = 1;

    else
      T3_7(i,j) = 0;
    endif

  endfor
endfor

%ID = 22 corresponds to T6_7
T6_7 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 6 && j_0 == 7) || (i_0 == 7 && j_0 == 6)
      T6_7(i,j) = 1;
    elseif (i_0 == 5 && j_0 == 2) || (i_0 == 2 && j_0 == 05)
      T6_7(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 6 && i_0 != 7 && i_0 != 5 && i_0 != 2)
      T6_7(i,j) = 1;
    else
      T6_7(i,j) = 0;
    endif
  endfor
endfor

%ID = 23 corresponds to T4_7
T4_7 = zeros(8, 8);
for i_0 = 0:7
  for j_0 = 0:7
    i = i_0 + 1; j = j_0 + 1;
    if (i_0 == 4 && j_0 == 7) || (i_0 == 7 && j_0 == 4)
      T4_7(i,j) = 1;
    elseif (i_0 == 5 && j_0 == 0) || (i_0 == 0 && j_0 == 5)
      T4_7(i,j) = 1;
    elseif (i_0 == j_0 && i_0 != 4 && i_0 != 7 && i_0 != 5 && i_0 != 0)
      T4_7(i,j) = 1;
    else
      T4_7(i,j) = 0;
    endif
  endfor
endfor

% Identity matrix, not necessary.
A = zeros(8,8); # Pre-allocate memory for performance

for i = 1:8
  for j = 1:8
    if (i == j)
      A(i,j) = 1;
    else
      A(i,j) = 0;
    endif
  endfor
endfor






