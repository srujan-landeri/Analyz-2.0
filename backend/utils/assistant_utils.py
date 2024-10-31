from utils.authenticate_utils import *
from phi.assistant import Assistant
from typing import List, Optional, Tuple

DB_URL = "postgresql+psycopg://ai:ai@localhost:5532/ai"
TABLE_NAME = "chats"

def generate_run_name(query: str) -> str:
    """
    Generate a run name for the assistant using `llama-3.1-70b-versatile model`.
    """
    from phi.llm.groq import Groq
    
    assistant = Assistant(
        llm=Groq(
            model="llama-3.1-70b-versatile"
        ),
        system_prompt="You will be given a query and you have to generate a title for that query"
    )
    
    return assistant.run("Generate a title for this query in 2 to 3 words, \n Format: title \n Remember that you should not answer the query \n\n Query: " + query, stream=False)

def set_model(assistant: Assistant, inference_engine:str, model:str) -> Optional[str]:
    """
    Set the model for the assistant.
    
    @param assistant: Assistant object.
    @param inference_engine: Inference engine to use.
    @param model: Model to use.
    """
    from phi.llm.groq import Groq
    from phi.llm.ollama import Ollama
    
    try:
        if inference_engine == "groq":
            assistant.llm = Groq(model=model)
        elif inference_engine == "ollama":
            assistant.llm = Ollama(model=model)
    
    except Exception as e:
        return f"Error: {str(e)}"
    
    return assistant

def get_assistant(
        user: str, 
        references: Optional[dict] = None,
        reference_string: Optional[str] = None,
        message: str = None,
        run_id: Optional[str] = None, 
        run_name: Optional[str] = None,
    ) -> Tuple[Assistant, Optional[str]]:
    """
    Creates a new assistant or loads an existing assistant for the user.
    
    @param user: User Email.
    @param references: Optional dictionary with additional references (e.g., image description).
    @param run_id: If run_id is provided, load existing assistant for the user, otherwise create a new assistant.
    @param run_name: If provided, sets the run_name for the assistant session.
    @return: Tuple containing the assistant and the current run_id.
    """
    
    from phi.storage.assistant.postgres import PgAssistantStorage
    from tools.scrape_website import WebsiteScrapperToolKit
    from tools.search_arxiv import ArxivAssistant 
    from tools.search_google import SerpApiToolKit
    from tools.search_pumbed import PumberAssistant
    from tools.search_youtube import YotubeSummarizerToolKit
    
    storage = PgAssistantStorage(table_name=TABLE_NAME, db_url=DB_URL)
    
    current_run_id: str = run_id if run_id else None
    
    assistant = Assistant(
        run_id=current_run_id,
        user_id=user,
        storage=storage,
        update_memory_after_run=True,
        add_chat_history_to_messages=True,
        num_history_messages=3,   
        instructions = [
            "For tasks related to youtube, work only with transcripts.",
            "Your responses should be clear and concise.",
            "Always format your responses in markdown format, with heading, bullet points, numbered lists, etc.",
        ],
        tools=[],
        debug_mode=True
    )
    
    if run_name:
        assistant.run_name = run_name

    if references:
        user_prompt = ""
        
        if references.get("image_description"):
            user_prompt += f"\nImage Description: {references.get('image_description')}\n"
        
        if references.get("websites"):
            assistant.tools.append(WebsiteScrapperToolKit().website_client)
            user_prompt += f"\n Scrape the following websites to answer user query: {references.get('websites')}\n"
        
        if references.get("youtube"):
            assistant.tools.append(YotubeSummarizerToolKit().youtube_client)
            user_prompt += f"\n You can refer the following youtube videos: {references.get('youtube')}\n"
        
        if message:
            user_prompt += f"\n Your are responsible to answer this question `{message}`"
            
        assistant.user_prompt = "References : " + reference_string + '\n' + user_prompt if len(user_prompt) > 0 else None + f"\nAnswer this query {message}"
    
    current_run_id = assistant.run_id if current_run_id is None else current_run_id
    return assistant, current_run_id


def generate_response(assistant: Assistant, message:str, inference_engine, model: str) -> str:
    """
    Generate response for the given message.
    
    @param assistant: Assistant object.
    @param message: Message to process.
    @param inference_engine: Inference engine to use.
    @param model: Model to use.
    """
    set_model(assistant, inference_engine, model)
    return assistant.run(message, stream=False)

def convert_code(text: str, source_language:str, target_language:str) -> str:
    """
    Convert the given text to code block.
    @param text: Text to convert.
    @param source_language: Source language of the text.
    @param target_language: Target language to convert the text.
    """
    
    supported_languages = {"javascript", "python", "java", "cpp", "ruby", "go", "swift", "rust", "php", "typescript"}
    if source_language not in supported_languages or target_language not in supported_languages:
        return {
            "error": f"Unsupported languages. Supported languages are {supported_languages}"
        }
    
    from groq import Groq
    
    client = Groq()
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": """
                    Convert the following given {source_language} code to {target_language} code.
                    Do not change the logic of the code.
                    Do not change the variable names.
                    Do not change the function names.
                    Do not change the comments.
                    Do not give any explanation, just convert the code.
                    Give the code in markdown format.
                    ```{source_language}
                    {text}
                    ```
                """.format(source_language=source_language, target_language=target_language, text=text)
            }
        ],
        model="llama3-groq-70b-8192-tool-use-preview",
    )

    response = chat_completion.choices[0].message.content 
    
    return {
        "code": response
    }
    
def generate_flowchart(query):
    """
    Generate flowchart for the given query.
    
    @param query: Query for which flowchart is to be generated.
    """
    
    from groq import Groq
    from rich.pretty import pprint
    
    pprint(f"Query: {query}")
    
    client = Groq()
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""
                    Generate a flowchart in Mermaid.js syntax for the following query:
                    {query}
                    
                    You must generate the flowchat strictly in Mermaid.js syntax.
                    Your response must be in json format
                    Additionally add clear explanation or any other information in the response for user to clearly understand.
                    Your reponse must not have any other explanation or information other than the json response.
                    Your response will used in json.loads() function, ensure that it is a valid json.
                    Only return the json response.
                    Add the flowchart in the json response with the key `flowchart`.
                    Add any additional information in the response with the key `explanation`.
                    The code has to be a single line as shown in the example.
                    
                    Example:
                    ```
                    {{
                        "flowchart": "graph TD; A-->B; A-->C; B-->D; C-->D;",
                        "explanation": "This is a simple flowchart"
                    }}
                    
                """
            }
        ],
        model="llama3-groq-70b-8192-tool-use-preview",
    )

    response = chat_completion.choices[0].message.content 
    print(response)
    
    import json
    response = json.loads(response)
    print(response)
    return response