from pydantic import BaseModel

class CodeRequest(BaseModel):
    text: str
    source_language: str
    target_language: str