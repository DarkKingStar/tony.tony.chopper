const welcomeData = {  	
          "intro":	"Welcome to the anitaku(gogoanime) provider: check out the provider's website @ https://anitaku.to/",
          "routes":	{
            'Search Anime' : "/search/:searchText",
            'Get Anime INFO': "/info/:animeid'",
            'Get Streamable Video links (.m3u8)':"/watch/:episodeId",
            'list of Anime in Categories': 
              {
                "New Season Anime": "/new-season?p='pageNo'",
                "Recently Released Anime":"/recent-released?p='pageNo'",
                "Currently Popular Anime":"/popular?p='pageNo'",
                "Anime Movies":"/anime-movies?p='pageNo'",
              },
            'All genres of Anime List':"/genres",
            'Get Anime of the type genre':"/genre/:type",
            'Get daily anime schedule of anime released': "/schedule",
          },
          "github": "All Infomation is provided in the github repo: https://github.com/DarkKingStar/tony.tony.chopper"
};

module.exports = { welcomeData};