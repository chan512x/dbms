from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'USERS'

    username = db.Column('USERNAME', db.String(255), nullable=False)
    hpassword = db.Column('HPASSWORD', db.String(255), nullable=False)
    email = db.Column('EMAIL', db.String(255), primary_key=True)

    def __repr__(self):
        return f"User(username={self.username}, email={self.email})"
    

class Playlist(db.Model):
    __tablename__ = 'PLAYLIST'
    play_id = db.Column('PLAY_ID', db.Integer, primary_key=True, autoincrement=True)
    email = db.Column('EMAIL', db.String(255), db.ForeignKey('USERS.EMAIL', ondelete='CASCADE'))
    user = db.relationship("User", backref="playlists")
    total_tracks = db.Column('TOTAL_TRACKS', db.Integer)
    play_name = db.Column('PLAY_NAME', db.String(50))

    def __repr__(self):
        return f"Playlist(play_id={self.play_id}, email={self.email}, total_tracks={self.total_tracks}, play_name={self.play_name})"

class Artist(db.Model):
    __tablename__ = 'ARTIST'

    artist_id = db.Column('ARTIST_ID',db.String(50), primary_key=True)
    artist_name = db.Column('ARTIST_NAME',db.String(255))
    img_url1 = db.Column('IMG_URL1',db.String(100))
    img_url2 = db.Column('IMG_URL2',db.String(100))
    img_url3 = db.Column('IMG_URL3',db.String(100))
    monthly_listeners = db.Column('MONTHLY_LISTENERS',db.Integer)

class Album(db.Model):
    __tablename__ = 'ALBUM'

    album_id = db.Column('ALBUM_ID',db.String(50), primary_key=True)
    img_url1 = db.Column('IMG_URL1',db.String(100))
    img_url2 = db.Column('IMG_URL2',db.String(100))
    img_url3 = db.Column('IMG_URL3',db.String(100))
    rel_date = db.Column('REL_DATE',db.String(255))
    total_tracks = db.Column('TOTAL_TRACKS',db.Integer)
    total_duration = db.Column('TOTAL_DURATION',db.Integer)
    album_name = db.Column('album_name',db.String(255))

class BelongsTo(db.Model):
    __tablename__ = 'BELONGS_TO'

    artist_id = db.Column('ARTIST_ID',db.String(50), db.ForeignKey('ARTIST.artist_id'), primary_key=True)
    album_id = db.Column('ALBUM_ID',db.String(50), db.ForeignKey('ALBUM.album_id'), primary_key=True)

class HasGenre(db.Model):
    __tablename__ = 'HASGENRE'

    album_id = db.Column('ALBUM_ID',db.String(50), db.ForeignKey('ALBUM.album_id'), primary_key=True)
    genre = db.Column('GENRE',db.String(30), primary_key=True)

class Song(db.Model):
    __tablename__ = 'SONG'

    song_id = db.Column('SONG_ID',db.String(50), primary_key=True)
    album_id = db.Column('ALBUM_ID',db.String(50), db.ForeignKey('ALBUM.album_id'))
    song_name = db.Column('SONG_NAME',db.String(255))
    img_url1 = db.Column('IMG_URL1',db.String(100))
    img_url2 = db.Column('IMG_URL2',db.String(100))
    img_url3 = db.Column('IMG_URL3',db.String(100))
    video_id = db.Column('video_id',db.String(255))

class PerformedBy(db.Model):
    __tablename__ = 'PERFORMED_BY'

    song_id = db.Column('SONG_ID',db.String(50), db.ForeignKey('SONG.song_id'), primary_key=True)
    artist_id = db.Column('ARTIST_ID',db.String(50), db.ForeignKey('ARTIST.artist_id'), primary_key=True)

class PlaylistHas(db.Model):
    __tablename__ = 'PLAYLIST_HAS'

    play_id = db.Column('PLAY_ID',db.Integer, db.ForeignKey('PLAYLIST.PLAY_ID'), primary_key=True)
    song_id = db.Column('SONG_ID',db.String(50), db.ForeignKey('SONG.SONG_ID'), primary_key=True)
    track_no=db.Column('TRACK_NO',db.Integer)

class CurrentPlaying(db.Model):
    __tablename__ = 'CURRENT_PLAYING'

    email = db.Column('EMAIL',db.String(255), db.ForeignKey('USERS.EMAIL'), primary_key=True)
    song_id = db.Column('SONG_ID',db.String(50), db.ForeignKey('SONG.SONG_ID'), primary_key=True)

    def __repr__(self):
        return f"CurrentPlaying(email={self.email}, song_id={self.song_id})"

