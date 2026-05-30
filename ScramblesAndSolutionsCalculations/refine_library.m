% =========================================================================
% Slide 'n Swap Library Refinement and Sorting Script (Robust Parser)
% =========================================================================
clear; clc;

input_filename = "puzzle_library.txt";
output_filename = "puzzle_library_final.js";

fprintf("Reading and parsing %s...\n", input_filename);

fid_in = fopen(input_filename, 'r');
if fid_in == -1
    error("Could not open input file!");
endif

% Pre-allocate temporary storage for the 1,343 rows x 28 columns
raw_matrix = zeros(1343, 28);
row_idx = 0;

% Read the file line by line
while ~feof(fid_in)
    line = fgetl(fid_in);

    % Strip out javascript syntax characters so only numbers and commas remain
    clean_line = strrep(line, 'const puzzleLibrary = [', '');
    clean_line = strrep(clean_line, '];', '');
    clean_line = strrep(clean_line, '[', '');
    clean_line = strrep(clean_line, ']', '');
    clean_line = strrep(clean_line, ',', ' '); % Convert commas to spaces

    % Convert the cleaned string of numbers into an Octave numeric vector
    nums = str2num(clean_line);

    % If the line successfully contained our 28 columns, save it
    if length(nums) == 28
        row_idx = row_idx + 1;
        raw_matrix(row_idx, :) = nums;
    endif
endwhile
fclose(fid_in);

fprintf("Successfully parsed %d valid rows.\n", row_idx);

fprintf("Trimming matrix down to 18 columns...\n");
% Keep all parsed rows, but slice it down to columns 1 through 18
trimmed_matrix = raw_matrix(1:row_idx, 1:18);

fprintf("Analyzing move depths for sorting...\n");
% Count how many entries in columns 9 through 18 are NOT equal to -1
move_columns = trimmed_matrix(:, 9:18);
move_counts = sum(move_columns != -1, 2);

fprintf("Sorting library from fewest to most moves...\n");
[~, sort_indices] = sort(move_counts);
sorted_matrix = trimmed_matrix(sort_indices, :);

% =========================================================================
% WRITE THE FINAL PRODUCTION JAVASCRIPT FILE
% =========================================================================
fprintf("Writing optimized data to %s...\n", output_filename);
fid_out = fopen(output_filename, 'w');

fprintf(fid_out, "// Slide 'n Swap Production Optimization Matrix Library\n");
fprintf(fid_out, "// Total Solvable States: %d\n", size(sorted_matrix, 1));
fprintf(fid_out, "// Columns 1-8: Board Layout States | Columns 9-18: Optimal Move Solution Sequence\n");
fprintf(fid_out, "const puzzleLibrary = [\n");

for r = 1:size(sorted_matrix, 1)
    row_data = sorted_matrix(r, :);

    fprintf(fid_out, "    [ ");
    % Print the 8 state layout digits
    for c = 1:8
        fprintf(fid_out, "%d, ", row_data(c));
    endfor
    % Print the 9 move tracks
    for c = 9:17
        fprintf(fid_out, "%2d, ", row_data(c));
    endfor
    % Print the 18th column and close the array bracket
    fprintf(fid_out, "%2d ],\n", row_data(18));
endfor

fprintf(fid_out, "];\n");
fclose(fid_out);

fprintf("\nSuccess! Your optimized file '%s' is ready for JavaScript!\n", output_filename);
