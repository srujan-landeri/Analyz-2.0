# 📘 Analyz

**Analyz** is a powerful, LLM-powered Visual Studio Code extension designed to provide developers with instant insights, assistance, and educational resources for a wide range of programming tasks. Whether it's troubleshooting code, translating algorithms across languages, or gaining insights from research papers, **Analyz** supports developers at every step.

Leveraging both open-source and premium language models—such as **LLaMA**, **Gemma**, **Mistral**, and **OpenAI**—**Analyz** is your go-to tool for smart, secure, and intuitive programming support. With user-friendly features, including secure Google OAuth2.0 authentication, **Analyz** ensures that every session is personalized, safe, and effective.

---
## ✨ Key Features

- 🌐 **Multi-Model Support**:  
  Access a variety of LLMs, including open-source models (e.g., **LLaMA** and **Mistral**) and premium models (**OpenAI**), enabling flexible, tailored responses based on user preference.

- 🔒 **Secure Authentication**:  
  Supports Google OAuth 2.0 for safe and easy user authentication, ensuring secure access to your personalized environment.

- 📝 **Enhanced Query Support**:  
  Responds to queries on various data inputs, including text, images, and (coming soon) voice, for a versatile and interactive experience.

- 🔍 **Web Search Integration**:  
  Improves accuracy and relevance by retrieving additional information through real-time web searches to supplement model-generated responses.

- 🎥 **YouTube Video Analysis**:  
  Allows users to input YouTube URLs, generating responses to questions related to the video content, providing insights without needing to watch entire videos.

- 🔄 **Code Translation & Conversion**:  
  Translates code across 70+ programming languages, helping users understand and utilize algorithms in their preferred language or framework.

- 📑 **Research Paper Search**:  
  Enables efficient search and analysis of research papers, allowing developers to stay informed with the latest advancements in their field.

- 📊 **Flowchart Generation**:  
  Automatically generates flowcharts from code, simplifying complex algorithms and enhancing understanding.

---

> 🚀 **Note**: The voice input feature is currently under development and will be available in future releases.


## 🛠️ Installation

Follow these steps to clone and run **Analyz** on your local system.

### 1. Prerequisites

- **Visual Studio Code**: Ensure you have the latest version installed. [Download VS Code](https://code.visualstudio.com/Download)
- **Node.js**: Required for running the extension. [Download Node.js](https://nodejs.org/)

### 2. Clone the Repository

Clone the **Analyz** repository to your local system using the following command:

```bash
git clone https://github.com/yourusername/analyz-vscode-extension.git
```

### 3. Navigate to the Project Directory

Move into the project directory:

```bash
cd analyz-vscode-extension
```

### 4. Install Dependencies

Install the necessary dependencies using npm:

```bash
npm install
```

### 5. Set the Environment Variables

```bash
setx GROK_API_KEY "your_grok_api_key"
setx OPENAI_API_KEY "your_openai_api_key"
setx OAUTH_GOOGLE_CLIENT_ID "your_google_client_id"
setx OAUTH_GOOGLE_CLIENT_SECRET "your_google_client_secret"
setx TAVILY_API_KEY "your_tavily_api_key"
```

### 6. Setup the Storage

- Download and install Docker Desktop from the [official Docker website](https://www.docker.com/products/docker-desktop).

- Once Docker is installed, you can run the PgVector container using the following command:

```bash
docker run -d \
  -e POSTGRES_DB=ai \
  -e POSTGRES_USER=ai \
  -e POSTGRES_PASSWORD=ai \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v pgvolume:/var/lib/postgresql/data \
  -p 5532:5432 \
  --name pgvector \
  phidata/pgvector:16
```

### 7. Run the Backend

Start the backend server:

```bash
cd backend
uvicorn app:app --reload
```

### 8. Run the Extension

Open the project in Visual Studio Code and run the extension using the following command:

```bash
F5
```

