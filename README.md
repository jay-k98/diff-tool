# diff-tool
A simple tool to search for a keyword in a git diff and show highlighted markup of the result as html.

## Required packages
    npm install simple-git diff2html commander

## Usage
    node diff-tool.js ~/path/to/git/repo base_branch branch_to_compare keyword -o ~/path/to/output.html

### Example
    node diff-tool.js ~/projects/my-project dev fix-typo tpyo -o ~/Desktop/fix-typo-diff.html

You can also search for multiple keywords by separating them with a comma
    node diff-tool.js ~/projects/my-project dev fix-typo tpyo,mistkae -o ~/Desktop/fix-typo-diff.html

To define a custom separator use the flag `-s`
    node diff-tool.js ~/projects/my-project dev fix-typo "tpyo;mistkae" -o ~/Desktop/fix-typo-diff.html -s ";"
