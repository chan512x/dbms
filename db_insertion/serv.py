import requests as r
import sys
from sys import argv, exit
from base64 import b64encode
import json
import mariadb
try:
    conn = mariadb.connect(
        user="root",
        password="system",
        host="127.0.0.1",
        port=3306,
        database="dummy"

    )
    print("success")
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

cur = conn.cursor()

def search_youtube(search_query):
    api_key = "AIzaSyA-5WkUvAZsYYNys9H6Dlz4fsGTqRqzToc"
    url = f"https://www.googleapis.com/youtube/v3/search?q={search_query}&key={api_key}&part=snippet&type=video&maxResults=1"
    try:
        response = r.get(url)
        response.raise_for_status()
        data = response.json()
        if data.get('items'):
            first_video_id = data['items'][0]['id']['videoId']
            return first_video_id
        else:
            return "No videos found."
    except r.exceptions.RequestException as e:
            return ":("
def do_request():
    with open('artists.txt', 'r') as file:
        contents = file.read()
    conn.autocommit=True

    entries = contents.split('\n')
    se=set()
    artset=set()
    albset=set()
    belset=set()
    pby=set()
    for entry in entries:
        artist_name = entry
        url = f"https://api.spotify.com/v1/search?type=artist&q={artist_name}"
        headers = {
            "Accept"        : "application/json",
            "Content-Type"  : "application/json",
        }
        with open("accesstoken.txt", "r") as infile:
            auth_key = infile.read()
            auth_key = auth_key[ 0 : len(auth_key) ]
        headers['Authorization'] = f"Bearer {auth_key}"
        myreq = r.get(url, headers=headers)
        content = myreq.content
        status_code = myreq.status_code 
        if status_code != 200:
            print("Error: status code:", status_code)
            exit(-1)
        json_data = json.loads(content)
        artists = json_data['artists']
        items = artists['items']
        for item in items:
            name = item['name']
            artist_id = item['id']
            imgL=[]
            for img in item['images']:
                imgL.append(img['url'])
            for i in range (0,4,1):
                imgL.append("nope")
            pop=item['popularity']
            if artist_id not in artset:
                try:
                    cur.execute(
                    "INSERT INTO ARTIST (ARTIST_ID,ARTIST_NAME,IMG_URL1,IMG_URL2,IMG_URL3,MONTHLY_LISTENERS) VALUES (?,?,?,?,?,?)", 
                    (artist_id,name,imgL[0],imgL[1],imgL[2],pop))
                    print(name+"inserted"+"Artist")
                except mariadb.Error as e:
                    print(f"Error: {e}")
                    print(name+"not inserted")
                
            url = f"https://api.spotify.com/v1/artists/{artist_id}/albums?limit=5&include_groups=album"
            se.add(artist_id)
            artset.add(artist_id)
            myreq1 = r.get(url, headers=headers)
            content1 = myreq1.content
            json_data1 = json.loads(content1)
            print(artist_name)
            for item1 in json_data1['items']:
                alname=item1['name']
                print(alname+"ne\n")
                al_id=item1['id']
                imgaL=[]
                for img1 in item1['images']:
                    imgaL.append(img1['url'])
                for i in range (0,4,1):
                    imgaL.append("nope")
                rdate=item1['release_date']
                total_tracks=item1['total_tracks']
                duration=0
                url = f"https://api.spotify.com/v1/albums/{al_id}/tracks?limit=3"
                myreq2 = r.get(url, headers=headers)
                content2 = myreq2.content
                json_data2 = json.loads(content2)
                itemarr=json_data2['items']
                if al_id not in albset:
                    try:
                        cur.execute(
                            "INSERT INTO ALBUM (ALBUM_ID,ALBUM_NAME,IMG_URL1,IMG_URL2,IMG_URL3,REL_DATE,TOTAL_TRACKS) VALUES (?,?,?,?,?,?,?)", 
                            (al_id,alname,imgaL[0],imgaL[1],imgaL[2],rdate,total_tracks))
                        print(alname+"inserted")
                    except mariadb.Error as e:
                        print(f"Error: {e}")
                        print(alname+"not inserted")
                else:
                    continue
                albset.add(al_id)
                url = f"https://api.spotify.com/v1/albums/{al_id}"
                myreq5 = r.get(url, headers=headers)
                content5 = myreq5.content
                json_data5 = json.loads(content5)
                itemarr5=json_data5
                genres=itemarr5['genres']
                for genre in genres:
                    cur.execute(
                            "INSERT INTO HASGENRE (ALBUM_ID,GENRE) VALUES (?,?)", 
                            (al_id,genre))
                if al_id+artist_id not in belset:
                    try:
                        cur.execute(
                                "INSERT INTO BELONGS_TO (ALBUM_ID,ARTIST_ID) VALUES (?,?)", 
                                (al_id,artist_id))
                        print("belongs to added")
                    except mariadb.Error as e:
                        print(f"Error: {e}")
                        print("belongs to not inserted")
                belset.add(al_id+artist_id)
                for itemarr1 in itemarr5['artists']:
                    artname=itemarr1['name']
                    aid=itemarr1['id']
                    if aid not in se:
                        url = f"https://api.spotify.com/v1/artists/{aid}"
                        myreq4 = r.get(url, headers=headers)
                        content4 = myreq4.content
                        json_data4 = json.loads(content4)
                        itemarr4=json_data4
                        imgL=[]
                        for img in itemarr4['images']:
                            imgL.append(img['url'])
                        pop=itemarr4['followers']['total']
                        for i in range (0,4,1):
                            imgL.append("nope")
                        if aid not in artset:
                            try:
                                cur.execute(
                                "INSERT INTO ARTIST (ARTIST_ID,ARTIST_NAME,IMG_URL1,IMG_URL2,IMG_URL3,MONTHLY_LISTENERS) VALUES (?,?,?,?,?,?)", 
                                (aid,artname,imgL[0],imgL[1],imgL[2],pop))
                                print(name+"inserted")
                            except mariadb.Error as e:
                                print(f"Error: {e}")
                                print(name+"not inserted")
                        se.add(aid)
                        artset.add(aid)
                        if al_id+aid not in belset:
                            cur.execute(
                                "INSERT INTO BELONGS_TO (ALBUM_ID,ARTIST_ID) VALUES (?,?)", 
                                (al_id,aid))
                        belset.add(al_id+aid)
                for item2 in json_data2['items']:
                    song_id=item2['id']
                    song_name=item2['name']
                    # print(song_name)
                    duration+=item2['duration_ms']
                    searchqu=song_name+" "+artist_name
                    linkk=searchqu
                    try:
                        cur.execute(
                            "INSERT INTO SONG (SONG_ID,SONG_NAME,ALBUM_ID,IMG_URL1,IMG_URL2,IMG_URL3,VIDEO_ID) VALUES (?,?,?,?,?,?,?)", 
                            (song_id,song_name,al_id,imgaL[0],imgaL[1],imgaL[2],linkk))
                        print(song_name+"inserted")
                    except mariadb.Error as e:
                        print(f"Error: {e}")
                        print(song_name+" not inserted")
                        # print(song_id+" "+imgaL[0]+" "+linkk)
                    url = f"https://api.spotify.com/v1/tracks/{song_id}"
                    myreq6 = r.get(url, headers=headers)
                    content6 = myreq6.content
                    json_data6 = json.loads(content6)
                    itemarr6=json_data6
                    for itemarr2 in itemarr6['artists']:
                        artname=itemarr2['name']
                        aid=itemarr2['id']
                        if aid not in se:
                            url = f"https://api.spotify.com/v1/artists/{aid}"
                            myreq3 = r.get(url, headers=headers)
                            content3 = myreq3.content
                            json_data3 = json.loads(content3)
                            itemarr3=json_data3
                            imgL=[]
                            for img in itemarr3['images']:
                                imgL.append(img['url'])
                            pop=itemarr3['followers']['total']
                            for i in range (0,4,1):
                                imgL.append("nope")
                            if aid not in artset:
                                try:
                                    cur.execute(
                                    "INSERT INTO ARTIST (ARTIST_ID,ARTIST_NAME,IMG_URL1,IMG_URL2,IMG_URL3,MONTHLY_LISTENERS) VALUES (?,?,?,?,?,?)", 
                                    (aid,artname,imgL[0],imgL[1],imgL[2],pop))
                                except mariadb.Error as e:
                                    print(f"Error: {e}")
                                    print("belongs to not inserted")
                            se.add(aid)
                            artset.add(aid)
                        if song_id+aid not in pby:
                            cur.execute(
                                "INSERT INTO PERFORMED_BY (SONG_ID,ARTIST_ID) VALUES (?,?)", 
                                (song_id,aid))
                        pby.add(song_id+aid)
                upqu="""UPDATE ALBUM SET TOTAL_DURATION = %s WHERE ALBUM_ID = %s"""
                try:
                    cur.execute(
                            upqu, 
                            (duration,al_id))
                    print("upd succ")
                except mariadb.Error as e:
                    print(f"Error: {e}")
                    print("upd not succ")
            break
        if len(se)==15:
                print("insertion complete")
                conn.commit()
                break
            
                



def main():
    do_request()
    # format_json_data(json_data) 

if __name__ == "__main__":
    main()