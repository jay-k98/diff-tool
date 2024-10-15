#!/usr/bin/env node

import simpleGit from 'simple-git';
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import * as Diff2Html from "diff2html";

// Define the CLI tool
program
  .argument('<repoPath>', 'Path to the Git repository')
  .argument('<baseBranch>', 'The base branch to compare')
  .argument('<prBranch>', 'The pull request branch to compare')
  .argument('<keyword>', 'Keyword to search in the diff')
  .option('-o, --output <outputPath>', 'Output path for the generated HTML file', './diff-output.html')
  .action(async (repoPath, baseBranch, prBranch, keyword, options) => {
    try {
      // Initialize the Git repository in the specified path
      const repoAbsolutePath = path.resolve(repoPath);
      const git = simpleGit(repoAbsolutePath);

      // Check out the base branch and pull request branch to get the diff
      await git.checkout(baseBranch);
      const baseCommit = await git.revparse('HEAD');
      
      await git.checkout(prBranch);
      const prCommit = await git.revparse('HEAD');

      // Get the diff between the two branches
      const diff = await git.diff([`${baseCommit}`, `${prCommit}`]);

      // Parse the diff using Diff2Html API
      const diffJson = Diff2Html.parse(diff);

      // Filter the changes that contain the keyword
      const filteredDiff = diffJson.map(file => {
        file.blocks = file.blocks.filter(block => 
          block.lines.some(line => line.content.includes(keyword))
        );
        return file;
      }).filter(file => file.blocks.length > 0);

      // Generate the HTML for the filtered diff using Diff2Html.html()
      const diffHtmlContent = Diff2Html.html(filteredDiff, { inputFormat: 'json', outputFormat: 'line-by-line' });

      // Write the full HTML content
      const diffHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Diff Output</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css">
          <script src="https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/github.min.css">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Git Diff with Keyword "${keyword}"</h1>
          <div id="diff"></div>
          <script>
            document.getElementById("diff").innerHTML = ${JSON.stringify(diffHtmlContent)};
            document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
          </script>
        </body>
      </html>
      `;

      // Write the HTML content to the specified file
      const outputFilePath = path.resolve(options.output);
      fs.writeFileSync(outputFilePath, diffHtml);

      console.log(`Diff with keyword "${keyword}" written to ${outputFilePath}`);
    } catch (error) {
      console.error('Error:', error);
    }
  });

// Parse the arguments from the command line
program.parse(process.argv);
