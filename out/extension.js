"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const polka_1 = __importDefault(require("polka"));
const url_1 = require("url");
// Add to your imports
const GOOGLE_CLIENT_ID = "944125795870-j1vgdubdra1njjjq7t8sumjrn0p1fj3i.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const REDIRECT_URI = 'http://localhost:54321/callback';
function activate(context) {
    const analyzViewProvider = new AnalyzViewProvider(context.extensionUri, context);
    const codeLensProvider = new ComplexityCodeLensProvider();
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(AnalyzViewProvider.viewType, analyzViewProvider));
    // Register for all file types
    context.subscriptions.push(vscode.languages.registerCodeLensProvider({ scheme: 'file' }, codeLensProvider));
    context.subscriptions.push(vscode.commands.registerCommand('extension.analyzeComplexity', async (document, range) => {
        try {
            const functionText = document.getText(range);
            console.log("functionText", functionText);
            // Send the function text to the webview for analysis
            if (analyzViewProvider._view) {
                analyzViewProvider.updateFunction(functionText, document.fileName);
            }
            else {
                await vscode.commands.executeCommand('analyz.focus');
                setTimeout(() => {
                    analyzViewProvider.updateFunction(functionText, document.fileName);
                }, 500);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to analyze complexity');
        }
    }));
}
class FunctionExtractor {
    constructor() {
        this.patterns = {
            javascript: {
                pattern: /(?:function\s+(\w+)\s*\([^)]*\)|(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>)|\b(?:class\s+(\w+)|(\w+)\s*:\s*function))/g,
                nameIndex: [1, 2, 3, 4]
            },
            typescript: {
                pattern: /(?:function\s+(\w+)\s*\([^)]*\)|(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>)|\b(?:class\s+(\w+)|(\w+)\s*:\s*function))/g,
                nameIndex: [1, 2, 3, 4]
            },
            python: {
                pattern: /(?:def\s+(\w+)\s*\([^)]*\)|class\s+(\w+))/g,
                nameIndex: [1, 2]
            },
            java: {
                pattern: /(?:(?:public|private|protected|static|\s) +(?:[a-zA-Z0-9_]+) +([a-zA-Z0-9_]+) *\([^)]*\) *(?:{|throws|$))/g,
                nameIndex: [1]
            },
            cpp: {
                pattern: /(?:(?:public|private|protected|static|\s) +(?:[a-zA-Z0-9_]+) +([a-zA-Z0-9_]+) *\([^)]*\) *(?:{|throws|$))/g,
                nameIndex: [1]
            }
        };
    }
    extractFunctions(code, language) {
        const results = [];
        const langPattern = this.patterns[language.toLowerCase()];
        if (!langPattern) {
            return [];
        }
        let match;
        while ((match = langPattern.pattern.exec(code)) !== null) {
            const name = langPattern.nameIndex
                .map((i) => match ? match[i] : undefined)
                .find((n) => n !== undefined);
            if (name) {
                const startIndex = match.index;
                const body = this.extractFunctionBody(code, startIndex, language);
                results.push({
                    name,
                    startIndex,
                    body,
                    range: {
                        start: startIndex,
                        end: startIndex + body.length
                    }
                });
            }
        }
        return results;
    }
    extractFunctionBody(code, startIndex, language) {
        if (language === 'python') {
            return this.extractPythonBody(code, startIndex);
        }
        let bracketCount = 0;
        let inString = false;
        let stringChar = '';
        let bodyStart = -1;
        let bodyEnd = -1;
        for (let i = startIndex; i < code.length; i++) {
            const char = code[i];
            if ((char === '"' || char === "'" || char === '`') && code[i - 1] !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                }
                else if (char === stringChar) {
                    inString = false;
                }
                continue;
            }
            if (!inString) {
                if (char === '{') {
                    if (bracketCount === 0) {
                        bodyStart = i;
                    }
                    bracketCount++;
                }
                else if (char === '}') {
                    bracketCount--;
                    if (bracketCount === 0) {
                        bodyEnd = i + 1;
                        break;
                    }
                }
            }
        }
        return bodyStart !== -1 && bodyEnd !== -1
            ? code.substring(startIndex, bodyEnd)
            : code.substring(startIndex);
    }
    extractPythonBody(code, startIndex) {
        const lines = code.substring(startIndex).split('\n');
        const firstLine = lines[0];
        const baseIndent = firstLine.match(/^\s*/)?.[0].length || 0;
        let bodyLines = [firstLine];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const indent = line.match(/^\s*/)?.[0].length || 0;
            if (line.trim().length === 0) {
                bodyLines.push(line);
                continue;
            }
            if (indent <= baseIndent && line.trim().length > 0) {
                break;
            }
            bodyLines.push(line);
        }
        return bodyLines.join('\n');
    }
}
class ComplexityCodeLensProvider {
    constructor() {
        this.functionExtractor = new FunctionExtractor();
    }
    async provideCodeLenses(document) {
        const codeLenses = [];
        const text = document.getText();
        // Determine language from file extension
        const fileName = document.fileName;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        let language = 'javascript'; // default
        switch (fileExtension) {
            case 'py':
                language = 'python';
                break;
            case 'ts':
                language = 'typescript';
                break;
            case 'js':
                language = 'javascript';
                break;
            case 'java':
                language = 'java';
                break;
            case 'cpp':
            case 'h':
            case 'hpp':
                language = 'cpp';
                break;
            default:
                return []; // Return empty array for unsupported file types
        }
        const functions = this.functionExtractor.extractFunctions(text, language);
        for (const func of functions) {
            const startPos = document.positionAt(func.startIndex);
            const endPos = document.positionAt(func.startIndex + func.body.length);
            const range = new vscode.Range(startPos, endPos);
            const codeLens = new vscode.CodeLens(range, {
                title: "Get Complexity",
                command: 'extension.analyzeComplexity',
                arguments: [document, range]
            });
            codeLenses.push(codeLens);
        }
        return codeLenses;
    }
}
class AnalyzViewProvider {
    constructor(_extensionUri, context) {
        this._extensionUri = _extensionUri;
        this.context = context;
        this._extenstionPath = _extensionUri.fsPath;
    }
    resolveWebviewView(webviewView, _context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        initThemeEvents(webviewView);
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'initiate-login':
                    this.handleGoogleLogin();
                    return;
                case 'check-auth-status':
                    const token = await this.context.secrets.get('google-token');
                    const user = await this.context.secrets.get('google-user');
                    // check if token is there
                    if (!token) {
                        webviewView.webview.postMessage({
                            type: 'auth-status',
                            value: false
                        });
                        return;
                    }
                    // check if token is valid
                    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const userData = await userResponse.json();
                    if (userData.error) {
                        this.handleLogout();
                        return;
                    }
                    // Send auth status to webview
                    webviewView.webview.postMessage({
                        type: 'auth-status',
                        value: !!token,
                        user: user ? JSON.parse(user) : null,
                        token: token
                    });
                    return;
                case 'logout':
                    this.handleLogout();
                case 'info':
                    vscode.window.showInformationMessage(data.message);
                    return;
                case 'error':
                    vscode.window.showErrorMessage(data.message);
                    return;
            }
        });
    }
    updateFunction(functionText, fileName) {
        if (this._view) {
            // Get the file extension to determine language
            const fileExtension = fileName.split('.').pop()?.toLowerCase();
            let language = 'javascript'; // default
            switch (fileExtension) {
                case 'py':
                    language = 'python';
                    break;
                case 'ts':
                    language = 'typescript';
                    break;
                case 'js':
                    language = 'javascript';
                    break;
                case 'java':
                    language = 'java';
                    break;
                case 'cpp':
                case 'h':
                case 'hpp':
                    language = 'cpp';
                    break;
            }
            const view = this._view;
            view.webview.postMessage({
                type: 'open-page',
                name: 'chat',
            });
            vscode.window.showInformationMessage('Created new chat...');
            setTimeout(() => {
                vscode.window.showInformationMessage('Analysing...');
                view.webview.postMessage({
                    type: 'time-complexity',
                    function: {
                        code: functionText,
                        language: language,
                        fileName: fileName
                    }
                });
            }, 1000);
        }
    }
    async handleLogout() {
        await this.context.secrets.delete('google-token');
        await this.context.secrets.delete('google-user');
        if (this._view) {
            this._view.webview.postMessage({
                type: 'auth-status',
                value: "logout"
            });
        }
    }
    async handleGoogleLogin() {
        const state = Math.random().toString(36).substring(7);
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}&` +
            `response_type=code&` +
            `scope=openid%20profile%20email&` +
            `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
            `state=${state}`;
        vscode.env.openExternal(vscode.Uri.parse(authUrl));
        const server = (0, polka_1.default)()
            .get('/callback', async (req, res) => {
            try {
                const queryParams = new url_1.URLSearchParams(req.url.split('?')[1]);
                const code = queryParams.get('code');
                const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new url_1.URLSearchParams({
                        code: code,
                        client_id: GOOGLE_CLIENT_ID,
                        client_secret: GOOGLE_CLIENT_SECRET,
                        redirect_uri: REDIRECT_URI,
                        grant_type: 'authorization_code',
                    }),
                });
                const tokenData = await tokenResponse.json();
                // Store token
                await this.context.secrets.store('google-token', tokenData.access_token);
                // Get user info
                const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${tokenData.access_token}`
                    }
                });
                const userData = await userResponse.json();
                await this.context.secrets.store('google-user', JSON.stringify(userData));
                // Send success message to webview
                if (this._view) {
                    this._view.webview.postMessage({
                        type: 'auth-success',
                        user: userData,
                        token: tokenData.access_token
                    });
                }
                res.end('Authentication successful! You can close this window.');
                if (server.server) {
                    server.server.close();
                    console.log("Server Closed");
                }
                else {
                    console.log('Server not found');
                }
            }
            catch (error) {
                console.error('Authentication error:', error);
                res.end('Authentication failed. Please try again.');
            }
        })
            .listen(54321);
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'webview.js'));
        const nonce = getNonce();
        return `<!DOCTYPE html>
		  <html lang="en">
			<head>
			  <meta charset="UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			    <meta http-equiv="Content-Security-Policy" content="
                    default-src 'none';
                    img-src 'self' vscode-webview://* data: https://accounts.google.com https://lh3.googleusercontent.com https://img.icons8.com https://cdn-icons-png.flaticon.com https://cdn.jsdelivr.net;
                    script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}' https://accounts.google.com https://cdn.jsdelivr.net;
                    style-src 'self' 'unsafe-inline' https://accounts.google.com https://cdn.jsdelivr.net;  /* Added CDN to style-src */
                    frame-src https://accounts.google.com;
                    connect-src 'self' http://localhost:8000 https://accounts.google.com;
                    sandbox allow-scripts allow-popups;
                ">

			  <title>React Webview</title>
			</head>
			<body>
			  <div id="root"></div>
			  <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		  </html>`;
    }
}
AnalyzViewProvider.viewType = 'analyz';
function initThemeEvents(webviewView) {
    // Sending theme info to the webview
    webviewView.webview.postMessage({
        type: 'theme-info',
        value: vscode.window.activeColorTheme.kind
    });
    // Listen for theme change events
    vscode.window.onDidChangeActiveColorTheme((theme) => {
        webviewView.webview.postMessage({
            type: 'theme-info',
            value: theme.kind
        });
    });
}
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map