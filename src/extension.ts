import * as vscode from 'vscode';
import polka from 'polka';
import { URLSearchParams } from 'url';

// Add to your imports
const GOOGLE_CLIENT_ID = "944125795870-j1vgdubdra1njjjq7t8sumjrn0p1fj3i.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const REDIRECT_URI = 'http://localhost:54321/callback';

export function activate(context: vscode.ExtensionContext) {
    const analyzViewProvider = new AnalyzViewProvider(context.extensionUri, context);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            AnalyzViewProvider.viewType,
            analyzViewProvider
        )
    );

    // Register a command that logs out the user
    context.subscriptions.push(vscode.commands.registerCommand('analyz.logout', async () => {
        await context.secrets.delete('google-token');
        vscode.window.showInformationMessage('Logged out successfully');

        // Send logout message to the webview
        if (analyzViewProvider._view && analyzViewProvider._view.webview) {
            analyzViewProvider._view.webview.postMessage({
                type: 'auth-status',
                value: false
            });
        }
    }));
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

                    console.log("Checking status " + token);
                    webviewView.webview.postMessage({
                        type: 'auth-status',
                        value: !!token,
                        user: user ? JSON.parse(user) : null
                    });
                    return;
                case 'logout':
                    await this.context.secrets.delete('google-token');
                    webviewView.webview.postMessage({
                        type: 'auth-status',
                        value: false
                    });
                    return;

                case 'info':
                    vscode.window.showInformationMessage(data.message);
                    return;

                case 'error':
                    vscode.window.showErrorMessage(data.message);
                    return;
            }
        });
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
                            user: userData
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
  connect-src 'self' http://localhost:8000;
  img-src 'self' vscode-webview://* data: https://accounts.google.com https://lh3.googleusercontent.com https://img.icons8.com https://cdn-icons-png.flaticon.com;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}' https://accounts.google.com;
  style-src 'self' 'unsafe-inline' https://accounts.google.com;
  frame-src https://accounts.google.com;
  connect-src https://accounts.google.com;
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
