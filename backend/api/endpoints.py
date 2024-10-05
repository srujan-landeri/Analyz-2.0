from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    model: str 

@router.post("/chat/completions/ollama")
async def get_completion_ollama(request: ChatRequest):
    """
    Get completions for the given query and model name using Ollama.
    """
    import ollama

    def _list_models():
        """
        List all the available models.
        """
        models = ollama.list()
        return [model["name"] for model in models["models"]]

    if request.model not in _list_models(): 
        return {"error": "Model not found."}

    response = ollama.chat(
        model=request.model,
        messages=[
            {
                "role": "user",
                "content": request.query 
            }
        ],
    )

    return response['message']

@router.post("/chat/completions/groq")
async def get_completion_groq(request: ChatRequest):
    """
    Get completions for the given query and model name using Groq.
    """
    from groq import Groq
    import os

    if os.environ.get("GROQ_API_KEY") is None:
        return {"error": "API key not found."}

    groq = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )

    response = groq.chat.completions.create(
        model=request.model,  # Updated this line
        messages=[
            {
                "role": "user",
                "content": request.query
            }
        ]
    )

    return response.choices[0].message
