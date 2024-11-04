# 📘 Analyz

**Analyz** is a powerful, LLM-powered Visual Studio Code extension designed to provide developers with instant insights, assistance, and educational resources for a wide range of programming tasks. Whether it's troubleshooting code, converting across languages, or gaining insights from research papers, **Analyz** supports developers at every step. Anlyze has access to both open-source and pro language models—such as **LLaMA**, **Gemma**, **Mistral**, and **OpenAI**—**Analyz** is your go-to tool for smart, secure, and intuitive programming support. With user-friendly features, including secure Google OAuth2.0 authentication, **Analyz** ensures that every session is personalized, safe, and effective.

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
  Translates code across programming languages, helping users understand and utilize algorithms in their preferred language or framework.

- 📑 **Research Paper Search**:  
  Enables efficient search and analysis of research papers, allowing developers to stay informed with the latest advancements in their field.

- 📊 **Flowchart Generation**:  
  Automatically generates flowcharts simplifying complex algorithms and enhancing understanding using `Mermaid`.

---

> 🚀 **Note**: Images and Voice input features are currently under development and will be available in future releases.

<br>

## 🗂️ Supported Models

- **Gemma**: 9B
- **Mistral**: Latest
- **GPT-4**: Latest
- **GPT-4o-mini**: Latest
- **llama3-groq-70b-8192-tool-use-preview**: Latest
- **llama-3.1-70b-versatile**: Latest

<br>

## 🛠️ Installation

Follow these steps to clone and run **Analyz** on your local system.

### 1. Prerequisites

- **Visual Studio Code**: Ensure you have the latest version installed. [Download VS Code](https://code.visualstudio.com/Download)
- **Node.js**: Required for running the extension. [Download Node.js](https://nodejs.org/)

### 2. Clone the Repository

Clone the **Analyz** repository to your local system using the following command:

```bash
git clone https://github.com/srujan-landeri/Analyz-2.0.git
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

## 🎥 User Conversation with Analyz

https://github.com/user-attachments/assets/862cb642-e366-4294-89f0-42b766cdbce6

- 🔒 **Secure Google OAuth Login**: Experience seamless and secure authentication to protect your data.
- 🎛️ **Choose the Model of Your Own**: Select from various supported models to tailor your experience.
- ⚡ **Fast Inference Using Groq**: Experience rapid responses powered by Groq’s inference capabilities.
- 📝 **Interactive Markdown Format**: Outputs are displayed in an interactive Markdown format, complete with copy features for easy usability.

## 📹 Chat History and Memory Retrieval

https://github.com/user-attachments/assets/a2e40d9c-3faf-4078-a7f1-08983c08ec32

### Key Points:
- 🗄️ **Session History Retrieval**: **Analyz** is capable of retrieving the history of all unique sessions, allowing users to revisit past interactions.
- 🗃️ **Database Storage**: All chats are securely stored in a PostgreSQL database, ensuring data integrity and accessibility.
- 🔄 **Chat Management**: Users can easily maintain their chat history by creating, deleting, and searching for chats, offering flexibility in managing their conversations.
- 📝 **Auto-Generated Chat Names**: Each newly created chat session automatically receives a unique name, making it easy for users to identify and manage their conversations.

## 🛠️ External Tools Use

https://github.com/user-attachments/assets/d601d15e-ea85-4901-9698-fabb7b479997

### Key Points:
- 🎥 **YouTube URL Analysis**: **Analyz** can analyze given YouTube URLs, providing insights and answers related to video content.
- 🔍 **Web Search Capability**: It can search the web for accurate information, enhancing the quality of responses with real-time data.
- 📚 **Research Paper Search**: **Analyz** supports searches on Arxiv and PubMed for research papers, assisting research students in accessing relevant literature efficiently.

## 📹 Additional Tools

https://github.com/user-attachments/assets/6f95093c-35b5-493f-8d73-7f86b2381f56

### Key Points:
- 🔄 **Code Conversion**: **Analyz** can convert code across various programming languages, aiding in understanding and application across different platforms.
- 📊 **Flowchart Generation**: It can generate detailed flowcharts, making complex concepts clearer and more accessible for users.
- 📈 **Complexity Analysis**: **Analyz** analyzes the complexity of different functions and provides insights for potential improvements, helping developers optimize their code.
