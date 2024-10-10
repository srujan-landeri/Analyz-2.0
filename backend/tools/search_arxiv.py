from phi.assistant import Assistant
from phi.tools.arxiv_toolkit import ArxivToolkit

class ArxivAssistant():
    def __init__(self):
        self.arxiv_client = ArxivToolkit()