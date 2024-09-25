const mariadb = require('mariadb');
const youtubesearchapi = require('youtube-search-api');
process.setMaxListeners(200000)
const pool = mariadb.createPool({
    user: "root",
    password: "system",
    host: "127.0.0.1",
    database: "dummy",
    pipelining: true

});
var k=0;
pool.getConnection()
    .then(conn => {
        conn.query("SELECT * from song")
            .then((rows) => {
                for (const item of rows) {
                    const sid = item['SONG_ID'];
                    const check=item['video_id'];
                    var fl=true;
                    const sq = "<" + item['video_id'] + ">";
                    for(i=0;i<check.length;i++)
                    {
                        if(check[i]==' ')
                        fl=false;
                    }
                    //console.log(item)
                    if(fl==false)
                    {youtubesearchapi.GetListByKeyword(sq, [true], [10], [{ type: "video" }])
                        .then((res) => {
                            const nw = res['items'][0]['id'];
                            console.log(nw); 
                            const updateStatement = `UPDATE song SET video_id = ? WHERE SONG_ID = ?`;
                            const params = [nw, sid];
                            console.log(sid+" "+item['song_name']+" "+k)
                            
                            conn.query(updateStatement, params)
                                .then((result) => {
                                    console.log('Rows updated:', result.affectedRows);
                                })
                                .catch((err) => {
                                    console.error('Error executing update statement:', err);
                                });
                
                        })
                        .catch((err) => {
                            console.error('Error fetching YouTube data:', err);
                        });}
                        k+=1

                }
            })
            .then(() => {
                conn.end();
            })
            .catch((err) => {
                console.error('Error executing query:', err);
                conn.end();
            });
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });
