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
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(AnalyzViewProvider.viewType, analyzViewProvider));
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