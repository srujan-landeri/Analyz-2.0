from fastapi import APIRouter, HTTPException
from fastapi import File, UploadFile
from typing import List, Dict, Tuple, Any, Optional

from models.RunName import RunName
from models.AuthenticationRequest import AuthenticationRequest 
from models.ChatRequest import ChatRequest

router = APIRouter()

# User authentication routes
@router.post("/authenticate")
async def authenticate_user(auth: AuthenticationRequest) -> Dict[str, Any]:
    """
    Authenticate user using Google access token.
    """
    import utils.authenticate_utils as auth_utils
    
    try:
        token:str = auth.access_token
        user: Dict[str, Any] = await auth_utils.authenticate(token)
        return user.get("user_info")
    
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
@router.post("/user/chat_history")
async def get_user_chat_history(auth: AuthenticationRequest) -> List[Dict[str, Any]]:
    """
    Get all chat conversations for the given user.
    """
    import utils.database_utils as db_utils
    import utils.authenticate_utils as auth_utils
    
    try:
        token: str = auth.access_token
        user: Dict[str, Any] = await auth_utils.authenticate(token)
        chats = db_utils.get_user_chats(user["user_info"]["email"])
        
        if not chats:
            return []
        
        return chats
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/run/{run_id}")
def get_run_details(run_id: str) -> Dict[str, Any]:
    """
    Get details for the given run id.
    """
    import utils.database_utils as db_utils
    
    try:
        return db_utils.get_run_details(run_id)
    
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
@router.delete("/run/{run_id}")
def delete_run_by_id(run_id: str) -> Dict[str, str]:
    """
    Delete a row from the user_chat table by run_id.
    """
    import utils.database_utils as db_utils
    
    try:
        db_utils.delete_row_by_run_id(run_id)
        return {"message": "Row deleted successfully"}
    
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
# Assistant routes
@router.post("/assistant/completions/chat")
async def generate_response(
    request: ChatRequest,
) -> Dict[str, Any]:
    """
    Generate response for the given message and optionally describe the uploaded image.
    
    @param message: User message.
    @param inference_engine: Model source (groq/ollama).
    @param model: Model name.
    @param access_token: Google access token.
    @param run_id: If run_id is provided, load existing assistant for the user, otherwise create new assistant.
    @param references: Optional dictionary with additional references (e.g., image).
    """
    
    import utils.assistant_utils as assistant_utils
    import utils.authenticate_utils as auth_utils
    import utils.vision_utils as vision_utils

    try:
        # Extract relevant request parameters
        message, inference_engine, model, access_token, run_id, input_references = (
            request.message, 
            request.inference_engine, 
            request.model, 
            request.access_token, 
            request.run_id,
            request.input_references
        )

        user = await auth_utils.authenticate(access_token)
        identifier = user["user_info"]["email"]
        run_name = None
            
        if run_id is None:
            run_name = assistant_utils.generate_run_name(message)

        references_for_model = {}
        
        if input_references:    
            # process input_references
            image_description = None
            if input_references.get("image"):
                image_description = await vision_utils.describe_image(input_references["image"])
                references_for_model["image_description"] = image_description
        
        assistant, current_run_id = assistant_utils.get_assistant(
            user=identifier, 
            run_id=run_id, 
            run_name=run_name, 
            references=references_for_model
        )

        response = assistant_utils.generate_response(assistant, message, inference_engine, model)
        
        return {
            "response": response,
            "run_id": current_run_id
        }
    
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)