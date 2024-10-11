from pydantic import BaseModel

class FlowchartRequest(BaseModel):
    query: str