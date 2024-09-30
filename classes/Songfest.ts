import ClientState from "../types/ClientState";
import Player from "./Player";
import Song from "./Song";

export default class Songfest {
    // songfest
    gameInProgress: boolean
    songfestOpen: boolean
    players: Array<Player>
    songsPerPerson: number
    theme: string
    host: Player
    // game
    songs: Array<Song>
    currentSong: Song  
    currentSongSubmitter: Player
    currentSongIndex: number
    phase: number
    playersLockedIn: Array<string>
    
    constructor() {
        this.gameInProgress = false
        this.songfestOpen = false
        this.players = []
    }

    startGame() {
        console.log("setting up game")
        this.songs = this.players.map((player) => player.songs).flat().filter((entry) => entry.initialized)

        let guessDistribution = {}
        this.players.forEach((entry) => {
            guessDistribution[entry.name] = 0
        })
        this.songs.forEach((entry) => {
            entry.guessDistribution = structuredClone(guessDistribution)
        })
        
        this.shuffleSongs()
        this.currentSongIndex = -1
        // set the first song
        this.nextSong()
        this.phase = -1
        this.playersLockedIn = []
        this.gameInProgress = true
    }

    nextPhase() {
        // if we are on phase 3 (end of a cycle), check if there is a next song. If not end the game
        if (this.phase == 3) {
            if (!this.nextSong()) {
                console.log("game is over")
                this.phase = 4
                // return so you don't change phase
                return 
            }
        }
        // move to the next phase
        this.phase = (this.phase + 1) % 4
        this.playersLockedIn = []
        console.log("now on phase", this.phase)
    }

    nextSong() {
        // check if there is a next song
        if (!this.songs[this.currentSongIndex + 1]) {
            return false
        }
        this.currentSongIndex = this.currentSongIndex + 1
        this.currentSong = this.songs[this.currentSongIndex]
        this.currentSongSubmitter = this.players.find((entry) => entry.name == this.currentSong.submitterName)
        console.log(`switching to song ${this.currentSongIndex + 1}/${this.songs.length}: ${this.currentSong.title} from ${this.currentSong.submitterName}`)
        return true
    }

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffleSongs() {
        let currentIndex = this.songs.length;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [this.songs[currentIndex], this.songs[randomIndex]] = [
            this.songs[randomIndex], this.songs[currentIndex]];
        }
    }

    toClientState() {
        const clientState: Omit<ClientState, "myPlayer"> = {
            gameInProgress: this.gameInProgress,
            songfestOpen: this.songfestOpen,
            theme: this.theme,
            songsPerPerson: this.songsPerPerson,
            currentSong: this.currentSong,
            phase: this.phase,
            playerNames: this.players.map((entry) => {
                return {
                    name: entry.name,
                    taken: entry.taken
                }
            })
        }
        return clientState
    }

    reset() {
        // songfest
        this.gameInProgress = false
        this.songfestOpen = false
        this.players = []
        this.songsPerPerson = undefined
        this.theme =undefined
        this.host = undefined
        // game
        this.songs = undefined
        this.currentSong = undefined
        this.currentSongSubmitter = undefined
        this.currentSongIndex = undefined
        this.phase = undefined
        this.playersLockedIn = undefined
    }
}