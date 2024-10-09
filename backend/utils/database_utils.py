from typing import List, Dict, Any
from rich.pretty import pprint

import psycopg2
from psycopg2 import sql

DB_URL = "postgresql+psycopg://ai:ai@localhost:5532/ai"
TABLE_NAME = "chats"

def get_user_chats(user: str) -> List[Dict[str, Any]]:
    """
    Get all chat conversations for the given user.
    
    Args:
        user: User Email.
    
    Returns:
        List of chat details for the user.
    """
    
    run_ids = []
    cursor = None
    connection = None
    
    try:
        connection = psycopg2.connect(
            host="localhost",
            database="ai",
            user="ai",
            password="ai",
            port="5532"
        )
        cursor = connection.cursor()
        
        select_query = sql.SQL("SELECT run_id FROM chats WHERE user_id = %s")
        cursor.execute(select_query, (user,))
        
        run_ids = [ run_id[0] for run_id in cursor.fetchall()]
        
        chats = []
        
        for run_id in run_ids:
            chat = get_run_details(run_id)
            if chat:
                chats.append(chat)
            
        return chats
        
    except (Exception, psycopg2.Error) as error:
        print(f"Error while fetching data: {error}")
        return []
        
    finally:
        if cursor:
            cursor.close()
            print("Cursor closed.")
        
        if connection:
            connection.close()
            print("Database connection closed.")        
    

def get_run_details(run_id: str) -> Dict[str, Any]:
    """
    Get details for the given run id.
    
    Args:
        run_id: run_id represents single conversation of the user.
    
    Returns:
        Dictionary containing run details.
    """
    
    cursor = None
    connection = None
    
    try:
        connection = psycopg2.connect(
            host="localhost",
            database="ai",
            user="ai",
            password="ai",
            port="5532"
        )
        cursor = connection.cursor()
        
        select_query = sql.SQL("SELECT * FROM chats WHERE run_id = %s")
        cursor.execute(select_query, (run_id,))
        
        chat_details = cursor.fetchone()
        
        
        if not chat_details:
            return {}
        
        return {
            "run_id": chat_details[0],
            "run_name": chat_details[2],
            "llm": {
                "name": chat_details[4]['name'],
                "model": chat_details[4]['model']
            },
            "chat_history": chat_details[5]['chat_history']
        }
    
    except (Exception, psycopg2.Error) as error:
        print(f"Error while fetching data: {error}")
        return {}
    
    finally:
        if cursor:
            cursor.close()
            print("Cursor closed.")
        
        if connection:
            connection.close()
            print("Database connection closed.")
    

def delete_row_by_run_id(run_id: str) -> bool:
    """
    Delete a row from the user_chat table by run_id using direct database connection.
    
    Args:
        run_id: run_id represents single conversation of the user.
    
    Returns:
        bool: True if deletion was successful, False otherwise.
    """
    
    connection = None
    cursor = None
    
    try:
        connection = psycopg2.connect(
            host="localhost",
            database="ai",
            user="ai",
            password="ai",
            port="5532"
        )
        cursor = connection.cursor()

        delete_query = sql.SQL("DELETE FROM chats WHERE run_id = %s")
        cursor.execute(delete_query, (run_id,))
        connection.commit()

        print(f"Row with run_id {run_id} has been deleted successfully.")
        return True

    except (Exception, psycopg2.Error) as error:
        print(f"Error while deleting row: {error}")
        return False
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            print("Database connection closed.")