from pydantic import BaseModel

class RunName(BaseModel):
    query: str