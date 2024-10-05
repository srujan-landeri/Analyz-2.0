from phi.assistant import Assistant
from phi.tools.arxiv_toolkit import ArxivToolkit

class ArxivAssistant(Assistant):
    def __init__(self):
        self.arxiv_client = ArxivToolkit()