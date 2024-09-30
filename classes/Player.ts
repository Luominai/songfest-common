import Song from "./Song"
import Score from "../classes/Score"

export default class Player {
    name: string
    socketId: string | null
    taken: boolean
    likedScore: Score
    themeScore: Score
    guessScore: number
    songs: Array<Song>
    
    constructor(name: string, numberOfSongs: number) {
        this.name = name
        this.socketId = null
        this.taken = false
        this.likedScore = new Score
        this.themeScore = new Score
        this.guessScore = 0
        this.songs = Array(numberOfSongs).fill(new Song(name))
    }

    rateSong(song: Song, songSubmitter: Player, score: { liked: Score; theme: Score; }) {
        // give score to the song and the song's submitter
        song.likedScore.add(score.liked)
        song.themeScore.add(score.theme)
        songSubmitter.likedScore.add(score.liked)
        songSubmitter.themeScore.add(score.theme)
    }

    guessSong(song: Song, songSubmitter: Player, guess: {playerName: string, time: number}) {
        // update guess distribution
        song.guessDistribution[guess.playerName] += 1
        // if the player guessed correctly, give points
        if (guess.playerName == songSubmitter.name) {
            this.guessScore += 1
            return true
        }
        return false
    }
}