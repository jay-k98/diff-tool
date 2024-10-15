# diff-tool
A simple tool to search for a keyword in a git diff and show highlighted markup of the result as html.

## Required packages
    npm install simple-git diff2html commander

## Usage
    node diff-tool.js ~/path/to/git/repo base_branch branch_to_compare keyword -o ~/path/to/output.html

### Example
    node diff-tool.js ~/projects/my-project dev fix-typo tpyo -o ~/Desktop/fix-typo-diff.html
