# Parser for the stellaris config file format

This is a parser for the stellaris config files. It can read files in the .cwt format and convert their contents into a json format. It outputs this converted json string into a config.json file that is then ready to use by some software that wants to read it. This parser is used by the stellaris-tech-tree in https://github.com/the-coding-owl/stellaris_tech_tree.

## Usage

`node app.js --game-dir=/path/to/stellaris`

The only parameter `--game-dir` is mandatory and needs to point to the stellaris installation directory.