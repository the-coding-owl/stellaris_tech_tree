const parser = {
    configString: '',
    tokenList: [],
    lastToken: {},
    parseConfigFile: function (configString) {
        this.configString = configString;
        this.createLexerTokens();
        this.parse();
        return this.configJson;
    },
    createLexerTokens: function () {
        let matches = this.configString.matchAll(/(?<string>"(?:\\"|[^"])+")|(?<linebreak>\n)|(?<comment>#.*)|(?<assign>=)|(?<object>{)|(?<objectend>})|(?<word>\S+)?/gi);
        for (let match of matches) {
            if (match.groups.comment != undefined) {
                continue;
            }
            if (match.groups.string != undefined) {
                this.stringToken(match.groups.string);
                continue;
            }
            if(match.groups.linebreak != undefined) {
                this.linebreakToken();
                continue;
            }
            if (match.groups.word != undefined) {
                this.wordToken(match.groups.word);
                continue;
            }
            if (match.groups.assign != undefined) {
                this.assignToken();
                continue;
            }
            if (match.groups.object != undefined) {
                this.startStructToken();
                continue;
            }
            if (match.groups.objectend != undefined) {
                this.endStructToken();
                continue;
            }
        }
    },
    wordToken: function(word) {
        this.addToken('word', word);
    },
    stringToken: function(string) {
        this.addToken('string', string);
    },
    startStructToken: function() {
        this.addToken('struct');
    },
    endStructToken: function() {
        this.addToken('structend');
    },
    assignToken: function() {
        this.addToken('assign');
    },
    linebreakToken: function() {
        if (this.lastToken.type != 'linebreak') {
            this.addToken('linebreak');
        }
    },
    addToken: function(type, value) {
        let token = {
            type: type,
            value: value
        };
        this.lastToken = token;
        this.tokenList.push(token);
    },
    parse: function() {
        this.configJson = {};
        this.addToJson(this.getToken(), this.configJson);
    },
    addToJson: function(token, parent) {
        if (token == undefined || token.type == undefined) {
            return;
        }
        let nextToken = this.getToken();
        if (nextToken == undefined) {
            return;
        }
        if (token.type == 'word') {
            let entryId = token.value;
            if (nextToken.type == 'linebreak') {
                // ignore for now
                nextToken = this.getToken();
                if (nextToken == undefined) {
                    return;
                }
            }
            if (nextToken.type == 'assign') {
                nextToken = this.getToken();
                if (nextToken == undefined) {
                    throw 'Error: Missing value in assignment!';
                }
                switch(nextToken.type) {
                    case 'string':
                    case 'word':
                        parent[entryId] = nextToken.value;
                        nextToken = this.getToken();
                        break;
                    case 'struct':
                        let subEntry = {};
                        this.addToJson(nextToken, subEntry);
                        parent[entryId] = subEntry;
                        nextToken = this.getToken();
                        break;
                }
            } else {
                parent = Object.assign(parent, [entryId]);
            }
        } else if (token.type == 'linebreak') {
            // ignore for now
        } else if (token.type == 'struct') {
            this.addToJson(nextToken, parent);
            return;
        } else if (token.type == 'structend') {
            return;
        }
        this.addToJson(nextToken, parent);
    },
    getToken: function() {
        return this.tokenList.shift();
    }
};

module.exports = parser;