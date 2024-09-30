import Score from "../classes/Score"
import axios from "axios"
import getYoutubeId from "get-youtube-id"
import youtubeApiKey from "../apiKey"

// const youtubeAPI = "https://yt.lemnoslife.com/videos"
const youtubeApi = "https://www.googleapis.com/youtube/v3/videos"

export default class Song {
    url: string
    videoId: string
    startSeconds: number
    endSeconds: number
    clipId: string
    submitterName: string
    themeScore: Score
    likedScore: Score
    guessDistribution: Record<string,number>
    title: string
    thumbnail: string

    initialized: boolean

    constructor(submitterName: string) {
        this.url = ""
        this.submitterName = submitterName
        this.startSeconds = 0
        this.endSeconds = 0
        this.initialized = false
    }
    
    async init(url: string, startSeconds: number, endSeconds: number) {
        this.url = url
        this.startSeconds = startSeconds
        this.endSeconds = endSeconds
        this.videoId = getYoutubeId(url)
        this.clipId = this.makeid(11)
        this.themeScore = new Score()
        this.likedScore = new Score()
        this.guessDistribution = {}
        this.getSongData()
        this.initialized = true
    }

    private async getSongData() {
        // make requests to Youtube Operational API to get the video Id and start/end times
        const response = await axios.get(youtubeApi, {
            params: {
                id: this.videoId,
                part: "snippet",
                fields: "items(snippet(title,thumbnails))",
                key: youtubeApiKey
            }
        })
        
        // get data
        const data = response.data
    
        // get specific parts of data
        this.title = data.items[0].snippet.title
        this.thumbnail = data.items[0].snippet.thumbnails.medium.url
    }

    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    private makeid(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

}