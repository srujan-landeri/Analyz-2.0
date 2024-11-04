from phi.tools.tavily import TavilyTools
from phi.assistant import Assistant 
import os
from phi.llm.groq import Groq

class TavilyApiToolKit():
    def __init__(self):
        print(os.getenv("TAVILY_API_KEY"))
        self.tavily_client = TavilyTools(api_key=os.getenv("TAVILY_API_KEY"), search_depth="basic", format="json")