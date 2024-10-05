# Setting up React in VS Code Extension Webview

## 1. Update Project Dependencies

First, you'll need to add React and related dependencies to your `package.json`. Run these commands in your extension's root directory:

```bash
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
npm install --save-dev webpack webpack-cli ts-loader css-loader style-loader
```

## 2. Create Webpack Configuration

Create a new file called `webpack.config.js` in your project root:

```javascript
const path = require('path');

module.exports = {
  entry: './src/webview/index.tsx',
  output: {
    path: path.resolve(__dirname, 'media'),
    filename: 'webview.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
```

## 3. Update tsconfig.json

Add or update your `tsconfig.json` to include React:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "outDir": "out",
    "lib": ["ES2020", "DOM"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true,
    "jsx": "react",
    "esModuleInterop": true
  },
  "exclude": ["node_modules", ".vscode-test"]
}
```

## 4. Create React Components

Create a new directory structure for your React files:
```
src/
  webview/
    components/
      App.tsx
    index.tsx
```

### src/webview/components/App.tsx
```tsx
import React from 'react';

export const App: React.FC = () => {
  const vscode = acquireVsCodeApi();

  const handleClick = () => {
    vscode.postMessage({
      type: 'alert',
      value: 'Hello from React!'
    });
  };

  return (
    <div>
      <h1>My React Webview</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};
```

### src/webview/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));
```

## 5. Update Extension Code

Modify your `AnalyzViewProvider` class to use the webpack bundle:

```typescript
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
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <title>React Webview</title>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}
```

## 6. Update package.json Scripts

Add a build script to your `package.json`:

```json
{
  "scripts": {
    "webpack": "webpack --mode development",
    "webpack-dev": "webpack --mode development --watch",
    "vscode:prepublish": "npm run webpack"
  }
}
```

## 7. Build Process

1. Run webpack to build your React code:
```bash
npm run webpack
```

2. Build your extension as usual:
```bash
npm run compile
```

Now when you run your extension, it will use React in the webview!

## Debugging Tips

- Use the Developer Tools console in VS Code to debug your webview
- Add `console.log` statements in your React components
- Use the VS Code debugger to set breakpoints in your extension code

Remember to rebuild your webpack bundle (`npm run webpack`) whenever you make changes to your React code.