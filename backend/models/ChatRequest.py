from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str
    model_name: str
