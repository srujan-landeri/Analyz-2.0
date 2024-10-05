from phi.tools.serpapi_tools import SerpApiTools
import os

class SerpApiToolKit():
    
    def __init__(self, search_youtube=True):
        self.search_youtube = search_youtube
        self.api_key = os.getenv("SERPAPI_KEY")
        
        self.serpapi_client = SerpApiTools(api_key=self.api_key, search_youtube=self.search_youtube)
