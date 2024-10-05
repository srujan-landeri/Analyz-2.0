from phi.assistant import Assistant
from phi.tools.youtube_tools import YouTubeTools
from phi.llm.groq import Groq

class YotubeSummarizerToolKit():
    def __init__(self):
        self.youtube_client = YouTubeTools()