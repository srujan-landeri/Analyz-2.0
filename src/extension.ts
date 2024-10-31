import * as vscode from 'vscode';
import polka from 'polka';
import { URLSearchParams } from 'url';

// Add to your imports
const GOOGLE_CLIENT_ID = "944125795870-j1vgdubdra1njjjq7t8sumjrn0p1fj3i.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const REDIRECT_URI = 'http://localhost:54321/callback';

export function activate(context: vscode.ExtensionContext) {
    const analyzViewProvider = new AnalyzViewProvider(context.extensionUri, context);
    const codeLensProvider = new ComplexityCodeLensProvider();

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            AnalyzViewProvider.viewType,
            analyzViewProvider
        )
    );

    // Register for all file types
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            { scheme: 'file' },
            codeLensProvider
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.analyzeComplexity', async (document: vscode.TextDocument, range: vscode.Range) => {
            try {
                const functionText = document.getText(range);
                console.log("functionText", functionText);
                
                // Send the function text to the webview for analysis
                if (analyzViewProvider._view) {
                    analyzViewProvider.updateFunction(functionText, document.fileName);
                } else {

                    await vscode.commands.executeCommand('analyz.focus');

                    setTimeout(() => {
                        analyzViewProvider.updateFunction(functionText, document.fileName);
                    }, 500);
                }
            } catch (error) {
                vscode.window.showErrorMessage('Failed to analyze complexity');
            }
        })
    );
}

class FunctionExtractor {
    private patterns: any;

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

    extractFunctions(code: string, language: string) {
        const results = [];
        const langPattern = this.patterns[language.toLowerCase()];
        
        if (!langPattern) {
            return [];
        }

        let match: RegExpExecArray | null;
        while ((match = langPattern.pattern.exec(code)) !== null) {
            const name = langPattern.nameIndex
                .map((i: number) => match ? match[i] : undefined)
                .find((n: string) => n !== undefined);

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

    private extractFunctionBody(code: string, startIndex: number, language: string): string {
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
                } else if (char === stringChar) {
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
                } else if (char === '}') {
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

    private extractPythonBody(code: string, startIndex: number): string {
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

class ComplexityCodeLensProvider implements vscode.CodeLensProvider {
    private functionExtractor: FunctionExtractor;
    public _view?: vscode.WebviewView;

    constructor() {
        this.functionExtractor = new FunctionExtractor();
    }

    async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
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

class AnalyzViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'analyz';
    public _view?: vscode.WebviewView;
    private _extenstionPath: string;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly context: vscode.ExtensionContext
    ) {
        this._extenstionPath = _extensionUri.fsPath;
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        initThemeEvents(webviewView);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.type) {
                case 'initiate-login':
                    this.handleGoogleLogin();
                    return;

                case 'check-auth-status':
                    const token = await this.context.secrets.get('google-token');
                    const user = await this.context.secrets.get('google-user');

                    // check if token is there
                    if(!token) {
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

    public updateFunction(functionText: string, fileName: string) {
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

            this._view.webview.postMessage({
                type: 'time-complexity',
                function: {
                    code: functionText,
                    language: language,
                    fileName: fileName
                }
            });
        }
    }

    private async handleLogout() {
        await this.context.secrets.delete('google-token');
        await this.context.secrets.delete('google-user');
        if (this._view) {
            this._view.webview.postMessage({
                type: 'auth-status',
                value: "logout"
            });
        }
    }

    private async handleGoogleLogin() {
        const state = Math.random().toString(36).substring(7);
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}&` +
            `response_type=code&` +
            `scope=openid%20profile%20email&` +
            `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
            `state=${state}`;

        vscode.env.openExternal(vscode.Uri.parse(authUrl));

        const server = polka()
            .get('/callback', async (req: any, res: any) => {
                try {
                    const queryParams = new URLSearchParams(req.url.split('?')[1]);
                    const code = queryParams.get('code');

                    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            code: code!,
                            client_id: GOOGLE_CLIENT_ID!,
                            client_secret: GOOGLE_CLIENT_SECRET!,
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
                    } else {
                        console.log('Server not found');
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                    res.end('Authentication failed. Please try again.');
                }
            })
            .listen(54321);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'webview.js')
        );

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
		  </html>`
    }
}

function initThemeEvents(webviewView: vscode.WebviewView) {

    // Sending theme info to the webview
    webviewView.webview.postMessage({
        type: 'theme-info',
        value: vscode.window.activeColorTheme.kind
    })

    // Listen for theme change events
    vscode.window.onDidChangeActiveColorTheme((theme) => {
        webviewView.webview.postMessage({
            type: 'theme-info',
            value: theme.kind
        })
    })

}


function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() { }
