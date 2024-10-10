from phi.tools.serpapi_tools import SerpApiTools
import os

class SerpApiToolKit():
    def __init__(self):
        self.api_key = os.getenv("SERPAPI_KEY")
        self.serpapi_client = SerpApiTools(api_key=self.api_key, search_youtube=False)
