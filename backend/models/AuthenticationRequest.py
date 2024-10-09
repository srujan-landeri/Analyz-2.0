from pydantic import BaseModel

class AuthenticationRequest(BaseModel):
    access_token: str