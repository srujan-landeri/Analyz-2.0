from phi.assistant import Assistant
from phi.tools.pubmed import PubmedTools
from phi.llm.groq import Groq

class ArxivAssistant(Assistant):
    def __init__(self):
        self.pumbed_client = PubmedTools()
    

