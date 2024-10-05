from phi.assistant import Assistant
from phi.llm.ollama import Ollama 

class Analyz:
    """
    The Analyz helps to analyze, debug, provide suggestions and recommendations for the given coding queries.
    """
    
    def __init__(self, model_name: str):
        """
        Initialize the assistant with the given model name.
        """
        self.model_name = model_name 
        self.model = Ollama(model=model_name)
        self.assitant = Assistant(
            name="Analyz",
            llm = self.model,
            add_chat_history_to_messages=True,
            num_history_messages=5,
            description="Assistant to help analyze, debug, provide suggestions and recommendations for the given coding queries.",
            instructions=[]
        )
        
    def query(self, query: str):
        """
        Query the assistant with the given query.
        """
        response = self.assitant.run(query, stream=False)
        return response