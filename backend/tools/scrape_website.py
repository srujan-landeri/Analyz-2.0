from phi.assistant import Assistant
from phi.tools.website import WebsiteTools
from phi.llm.groq import Groq

class WebsiteScrapperToolKit():
    def __init__(self):
        self.website_client = WebsiteTools()