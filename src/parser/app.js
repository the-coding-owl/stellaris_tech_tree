const args = require('minimist') (process.argv.slice(2));
if (!args['game-dir']) {
    console.log('Required argument "game-dir" must be provided!');
}

const fs = require('fs');

try {
    let configJson = {};
    if (fs.existsSync(args['game-dir'])) {
        const gameDir = args['game-dir'] + '/common/technology';
        const parser = require('./parser.js');

        fs.readdirSync(gameDir, {withFileTypes: true}).map(dirEntry => {
            if (dirEntry.isFile()) {
                console.log('Read file "' + dirEntry.name + '"');
                const file = fs.readFileSync(gameDir + '/' + dirEntry.name, {encoding: 'utf-8', flag: 'r'});
                let newConfigJson = parser.parseConfigFile(file);
                configJson = Object.assign(configJson, newConfigJson);
            }
        });

        fs.writeFileSync('data/config.json', JSON.stringify(configJson));
    } else {
        throw new Error('The game dir does not exist!');
    }
} catch(err) {
    console.log(err);
    process.exitCode = 1;
}
