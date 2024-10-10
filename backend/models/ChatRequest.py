from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    inference_engine: str
    model: str
    access_token: str
    run_id: str = None
    input_references: str = None