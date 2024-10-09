from phi.assistant import Assistant
from phi.llm.groq import Groq
from phi.storage.assistant.postgres import PgAssistantStorage

DB_URL = "postgresql+psycopg://ai:ai@localhost:5532/ai"
TABLE_NAME = "reference_test"

storage = PgAssistantStorage(
    table_name="assistant_runs",
    db_url=DB_URL,
)

image_description = "The image appears to be a screenshot of a computer screen with a menu bar and icons highlighting the \"Scrape Website\" option. The overall context suggests that it may be a screenshot from a web scraper or a website development tool.\n\nHere are some key elements in the image:\n\n* A menu bar:\n\t+ The menu bar is located at the top of the image.\n\t+ It has several options, including \"Upload file\", \"Scrape Website\", and \"Youtube URL\".\n\t+ The \"Scrape Website\" option is highlighted in a gray box.\n* A search bar:\n\t+ The search bar is located below the menu bar.\n\t+ It has a magnifying glass icon next to it.\n\t+ The search bar is likely used to search for websites to scrape.\n* A text box:\n\t+ The text box is located below the search bar.\n\t+ It has a placeholder text that says \"Ask me anything...\".\n\t+ The text box is likely used to enter search queries or website URLs.\n\nOverall, the image suggests that the user is interested in scraping websites and may be using a web scraping tool or software to do so. The presence of a search bar and a text box indicates that the user may need to search for specific websites or enter specific search queries to scrap."
assistant = Assistant(
    storage=storage,
    llm=Groq(
        model="llama3-groq-70b-8192-tool-use-preview"
    ),
    
    user_prompt =
    f"""
        User has uploaded an image, here is the description of the image:
        <image_description>
            {image_description}
        </image_description>
    """
)

assistant.print_response("What is in this image?")