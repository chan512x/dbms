from flask import Blueprint, request, jsonify
from .models import User, db,Playlist,Artist,Album,BelongsTo,HasGenre,Song,PerformedBy,PlaylistHas,CurrentPlaying
from flask_jwt_extended import create_access_token, jwt_required,get_jwt_identity
from sqlalchemy import or_
main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    hashed_password = data.get('password')  
    email = data.get('email')

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'msg': 'User with this email already exists'}), 400

    new_user = User(username=username, hpassword=hashed_password, email=email)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token),201

@main_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email, hpassword=password).first()
    if not user:
        return jsonify({'msg': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token),201

@main_blueprint.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    the_current_user = []
    ran_js={
        'email':user.email,
        'username':user.username
    }
    the_current_user.append(ran_js)
    return jsonify(the_current_user),200


@main_blueprint.route('/playlists', methods=['GET'])
@jwt_required()
def playlists():
    current_user = get_jwt_identity()
    playlists = Playlist.query.filter_by(email=current_user).all()
    serialized_playlists = []

    for playlist in playlists:
        serialized_playlist = {
            'play_id': playlist.play_id,
            'total_tracks': playlist.total_tracks,
            'play_name': playlist.play_name
        }
        serialized_playlists.append(serialized_playlist) 

    return jsonify(serialized_playlists)

@main_blueprint.route('/playlists/<int:play_id>', methods=['GET'])
@jwt_required()
def get_playlist(play_id):
    current_user = get_jwt_identity()
    playlist = Playlist.query.filter_by(email=current_user, play_id=play_id).first()

    if not playlist:
        return jsonify({'msg': 'Playlist not found'}), 404
    
    tracks1=PlaylistHas.query.filter_by(play_id=playlist.play_id).all()
    tracks=[]
    for track1 in tracks1:
        sid=track1.song_id
        mtr=Song.query.filter_by(song_id=sid).first()
        
        artists=[]
        pbys=PerformedBy.query.filter_by(song_id=mtr.song_id).all()
        
        for pby in pbys:
            ran=Artist.query.filter_by(artist_id=pby.artist_id).first()
            artists.append({
                'artist_name':ran.artist_name,
                'artist_id':ran.artist_id
            })
        
        mal=Album.query.filter_by(album_id=mtr.album_id).first()
        
        track={
            'song_name':mtr.song_name,
            'song_id':mtr.song_id,
            'artists':artists,
            'album':mal.album_name,
            'image':mal.img_url2,
            'track_no':track1.track_no,
            'video_id':mtr.video_id
        }
        tracks.append(track)

    final_ans={
        "play_id":playlist.play_id,
        'total_tracks': playlist.total_tracks,
        'play_name': playlist.play_name,
        'tracks':tracks
    }

    return jsonify(final_ans), 200

@main_blueprint.route('/currently-playing', methods=['GET'])
@jwt_required()
def curplay():
    current_user = get_jwt_identity()
    sid=(CurrentPlaying.query.filter_by(email=current_user).first()).song_id
    mtr=Song.query.filter_by(song_id=sid).first()
    alid=mtr.album_id
    albu=(Album.query.filter_by(album_id=alid).first()).img_url1
    artists=[]
    pbys=PerformedBy.query.filter_by(song_id=mtr.song_id).all()
    for pby in pbys:
        ran=Artist.query.filter_by(artist_id=pby.artist_id).first()
        artists.append({
            'artist_name':ran.artist_name,
            'artist_id':ran.artist_id
        })
    track={
            'song_name':mtr.song_name,
            'song_id':mtr.song_id,
            'artists':artists,
            'image':albu
        }
    return jsonify(track), 200

@main_blueprint.route('/change-current/<string:song_id>', methods=['PUT'])
@jwt_required()
def changecur(song_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    ins=CurrentPlaying.query.filter_by(email=user.email).first()
    ins.song_id=song_id
    db.session.commit()
    return jsonify({'msg': f'Current playing song updated to {song_id}'}), 204

@main_blueprint.route('/get-current', methods=['GET'])
@jwt_required()
def getcur():
    current_user = get_jwt_identity()
    
    ins=CurrentPlaying.query.filter_by(email=current_user).first()
    vid=Song.query.filter_by(song_id=ins.song_id).first()
    vid_id={
        "video_id":vid.video_id
    }
    return jsonify(vid_id), 201

@main_blueprint.route('/addplaylist/<string:play_name>', methods=['POST'])
@jwt_required()
def addplaylist(play_name):
    current_user = get_jwt_identity()
    new_playlist = Playlist(play_name=play_name, email=current_user,total_tracks=0)
    db.session.add(new_playlist)
    db.session.commit()
    
    return jsonify(message="Playlist added successfully", play_id=new_playlist.play_id), 201

@main_blueprint.route('/playlists/<int:playlist_id>', methods=['DELETE'])
@jwt_required()
def delete_playlist(playlist_id):
    current_user = get_jwt_identity()
    playlist = Playlist.query.filter_by(email=current_user, play_id=playlist_id).first()

    if not playlist:
        return jsonify({'msg': 'Playlist not found'}), 404

    db.session.delete(playlist)
    db.session.commit()

    return jsonify({'msg': 'Playlist deleted successfully'}), 200
    
@main_blueprint.route('/getall', methods=['GET'])
@jwt_required()
def get_all():
    tracks1 = Song.query.limit(30).all()
    tracks=[]
    for track1 in tracks1:
        sid=track1.song_id
        mtr=Song.query.filter_by(song_id=sid).first()
        
        artists=[]
        pbys=PerformedBy.query.filter_by(song_id=mtr.song_id).all()
        
        for pby in pbys:
            ran=Artist.query.filter_by(artist_id=pby.artist_id).first()
            artists.append({
                'artist_name':ran.artist_name,
                'artist_id':ran.artist_id
            })
        
        mal=Album.query.filter_by(album_id=mtr.album_id).first()
        track={
            'song_name':mtr.song_name,
            'song_id':mtr.song_id,
            'artists':artists,
            'album':mal.album_name,
            'image':mal.img_url2,
            'video_id':mtr.video_id,
            'artists':artists,
            'album_id':mal.album_id
        }
        tracks.append(track)

    final_ans={
        
        'tracks':tracks
    }

    return jsonify(final_ans), 200

@main_blueprint.route('/addtoplay', methods=['POST'])
@jwt_required()
def addtoplay():
    data = request.json
    play_id = data.get('play_id')
    song_id = data.get('song_id')
    if play_id is None or song_id is None:
        return jsonify({'error': 'play_id and song_id are required'}), 400
    ins = PlaylistHas(play_id=play_id, song_id=song_id)
    db.session.add(ins)
    db.session.commit()
    return jsonify("Successful"), 201

@main_blueprint.route('/deletefromplay', methods=['POST'])
@jwt_required()
def deletefromplay():
    data = request.json
    play_id = data.get('play_id')
    song_id = data.get('song_id')
    if play_id is None or song_id is None:
        return jsonify({'error': 'play_id and song_id are required'}), 400
    ins = PlaylistHas.query.filter_by(play_id=play_id, song_id=song_id).first()
    db.session.delete(ins)
    db.session.commit()
    return jsonify("Successful"), 201

@main_blueprint.route('/search', methods=['GET'])
@jwt_required()
def search():
    searchqu=request.headers.get('Search-param')
    songs = (Song.query
             .join(PerformedBy, Song.song_id == PerformedBy.song_id)
             .join(Artist, PerformedBy.artist_id == Artist.artist_id)
             .join(Album, Song.album_id == Album.album_id)
             .filter(or_(Song.song_name.ilike(f'%{searchqu}%'), 
                         Artist.artist_name.ilike(f'%{searchqu}%'),
                         Album.album_name.ilike(f'%{searchqu}%'))).all())   
    
    tracks=[]
    for track1 in songs:
        sid=track1.song_id
        mtr=Song.query.filter_by(song_id=sid).first()
        
        artists=[]
        pbys=PerformedBy.query.filter_by(song_id=mtr.song_id).all()
        
        for pby in pbys:
            ran=Artist.query.filter_by(artist_id=pby.artist_id).first()
            artists.append({
                'artist_name':ran.artist_name,
                'artist_id':ran.artist_id
            })
        
        mal=Album.query.filter_by(album_id=mtr.album_id).first()
        
        track={
            'song_name':mtr.song_name,
            'song_id':mtr.song_id,
            'artists':artists,
            'album':mal.album_name,
            'image':mal.img_url2,
            'video_id':mtr.video_id,
            'album_id':mtr.album_id
        }
        tracks.append(track)

    final_ans={
        
        'tracks':tracks
    }

    return jsonify(final_ans), 200

@main_blueprint.route('/album', methods=['GET'])
@jwt_required()
def album():
    alqu=request.headers.get('Album-param')
    album=Album.query.filter_by(album_id=alqu).first()
    tracks1=Song.query.filter_by(album_id=alqu).all()
    tracks=[]
    for track1 in tracks1:
        sid=track1.song_id
        mtr=Song.query.filter_by(song_id=sid).first()
        
        artists=[]
        pbys=PerformedBy.query.filter_by(song_id=mtr.song_id).all()
        
        for pby in pbys:
            ran=Artist.query.filter_by(artist_id=pby.artist_id).first()
            artists.append({
                'artist_name':ran.artist_name,
                'artist_id':ran.artist_id
            })
        
        track={
            'song_name':mtr.song_name,
            'song_id':mtr.song_id,
            'artists':artists,
            'album':album.album_name,
            'image':album.img_url2,
            'video_id':mtr.video_id,
            'artists':artists,
            'album_id':album.album_id
        }
        tracks.append(track)

    final_ans={
        'album_id':alqu,
        'tracks':tracks,
        'album_name':album.album_name,
        'image':album.img_url2,
        'total_tracks':album.total_tracks,
        'total_duration':album.total_duration,
        'rel_date':album.rel_date
    }

    return jsonify(final_ans), 200

@main_blueprint.route('/artist', methods=['GET'])
@jwt_required()
def artist():
    arqu=request.headers.get("Artist-Param")
    pb=PerformedBy.query.filter_by(artist_id=arqu).all()    
    al_ids=set(())
    tracks=[]
    for track1 in pb:
        sid=track1.song_id
        mtr=Song.query.filter_by(song_id=sid).first()
        artists=[]
        pbys=PerformedBy.query.filter_by(song_id=mtr.song_id).all()
        al_ids.add(mtr.album_id)
        for pby in pbys:
            ran=Artist.query.filter_by(artist_id=pby.artist_id).first()
            artists.append({
                'artist_name':ran.artist_name,
                'artist_id':ran.artist_id
            })
        mal=Album.query.filter_by(album_id=mtr.album_id).first()

        track={
            'song_name':mtr.song_name,
            'song_id':mtr.song_id,
            'artists':artists,
            'album':mal.album_name,
            'image':mal.img_url2,
            'video_id':mtr.video_id,
            'artists':artists,
            'album_id':mal.album_id
        }
        tracks.append(track)

    albums=[]
    for id in al_ids:
        cural=Album.query.filter_by(album_id=id).first()
        teal={
            'album_name':cural.album_name,
            'album_id':cural.album_id,
            'image':cural.img_url2,
            'total_tracks':cural.total_tracks
        }
        albums.append(teal)
    art=Artist.query.filter_by(artist_id=arqu).first()
    artist={
        'artist_name':art.artist_name,
        'artist_id':art.artist_id,
        'image':art.img_url2,
        'ml':art.monthly_listeners
    }
    final_ans={
        'albums':albums,
        'tracks':tracks,
        'artist':artist
        
    }

    return jsonify(final_ans), 200

