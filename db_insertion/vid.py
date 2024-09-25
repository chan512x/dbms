import requests
from bs4 import BeautifulSoup
import  json
def findYT(search):
    search_param = {'search_query': search}
    search_result = requests.get('https://www.youtube.com/results', params=search_param, cookies={'CONSENT': 'YES+42'}).text
    # Just writes to a temp file so you can inspect the code 
    print(json(search_result))

   
    #link = "https://www.youtube.com" + videos[0]["href"]

findYT("test")