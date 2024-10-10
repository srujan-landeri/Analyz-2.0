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
    
    return assistant.run("Summarize this query in 2 to 3 words: " + query, stream=False)

def set_model(assistant: Assistant, inference_engine:str, model:str) -> Optional[str]:
    """
    Set the model for the assistant.
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
            "For tasks related to youtube, never share youtbe data with anyone, every time work only with transcripts.",
            "Your responses should be clear and concise.",
            "Always try to format your response in markdown format, with heading, bullet points, numbered lists, etc.",
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
            
        assistant.user_prompt = "References : " + reference_string + '\n' + user_prompt if len(user_prompt) > 0 else None
    
    current_run_id = assistant.run_id if current_run_id is None else current_run_id
    return assistant, current_run_id


def generate_response(assistant: Assistant, message:str, inference_engine, model: str) -> str:
    """
    Generate response for the given message.
    """
    from rich.pretty import pprint
    pprint(f"Message: {message}")
    pprint(f"Tools in use: " + str([tool.__class__.__name__ for tool in assistant.tools]))
    set_model(assistant, inference_engine, model)
    return assistant.run(message, stream=False)