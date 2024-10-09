from typing import Dict, Any
import httpx
from fastapi import HTTPException

class GoogleAuthError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

async def validate_token_format(token: str) -> bool:
    return bool(token and isinstance(token, str) and token.startswith("ya29."))

async def get_google_user_info(access_token: str) -> Dict[str, Any]:
    if not await validate_token_format(access_token):
        raise GoogleAuthError("Invalid token format", status_code=400)

    url = 'https://www.googleapis.com/oauth2/v2/userinfo'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=10.0)
            
            if response.status_code == 401:
                error_detail = response.json().get('error', {}).get('message', 'Token is invalid or expired')
                raise GoogleAuthError(f"Authentication failed: {error_detail}", status_code=401)
            elif response.status_code != 200:
                raise GoogleAuthError(f"Google API error: {response.text}", status_code=response.status_code)
            
            return response.json()
        
        except httpx.TimeoutException:
            raise GoogleAuthError("Request to Google API timed out", status_code=504)
        except httpx.HTTPError as e:
            raise GoogleAuthError(f"HTTP request failed: {str(e)}", status_code=500)

async def authenticate(access_token: str) -> Dict[str, Any]:
    """
    Authenticate user using Google access token.
    
    @param access_token: Google access token.
    """
    try:
        print(access_token)
        user_info = await get_google_user_info(access_token)
        return {"user_info": user_info}
    except GoogleAuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during authentication: {str(e)}")

async def main():
    try:
        # user = await authenticate("ya29.a0AcM612wJTquNdxyz4A5iotR1Qd5UFq21-6TvcQyrjAdqZw3J9FjME0t6JNO_G2-Bx3fLcHOrkKPc43zocqKLcfyhbyooS-IhT5ImjHawtUcgb-ejJ52p7ABXLz8i8xee_J1BHV2YW6vSoQ4Px9bb3rZ2xTkJj_nwM9z63_M-aCgYKAdwSARASFQHGX2Mi9xjt0AoPxwU9syuJ3fZkmA0175")
        user = await authenticate("ya29.a0AcM612zKC0_XU5ASb7yX2tXckmuOmHjwl88xV9GxU4qtLi4kNxOgJmzsG31SMSwI_W2UH_PdD64tgKAVEb9Kwyx4sKaWbwOftRwOvZ_Tv3eeYZffdWj3E5d-wEr2kzp0643xyL6i8rxCgVakPLOovqbEzUnI1J97zx9v9_pSaCgYKAaQSARASFQHGX2Mia41URO8CpnItuKL60V5Bhg0175")
        print(user)
    except HTTPException as e:
        print(f"Authentication failed: {e.detail}")