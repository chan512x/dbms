import requests

def search_youtube():
    search_query = input("Enter your search query: ")
    api_key = "AIzaSyA-5WkUvAZsYYNys9H6Dlz4fsGTqRqzToc"
    url = f"https://www.googleapis.com/youtube/v3/search?q={search_query}&key={api_key}&part=snippet&type=video&maxResults=1"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if data.get('items'):
            first_video_id = data['items'][0]['id']['videoId']
            video_link = f"https://www.youtube.com/watch?v={first_video_id}"
            print("Video Link:", video_link)
        else:
            print("No videos found.")
    except requests.exceptions.RequestException as e:
        print("Error fetching search results:", e)

if __name__ == "__main__":
    search_youtube()
