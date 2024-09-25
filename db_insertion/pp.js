const youtubesearchapi = require("youtube-search-api");
youtubesearchapi.GetListByKeyword("<hello adele>", [true], [10], [{ type: "video" }])
                        .then((res) => {
                            console.log( res['items'][0]['id'])})