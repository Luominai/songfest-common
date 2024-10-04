import ClientState from "../types/ClientState";
import Player from "./Player";
import Score from "./Score";
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

    rateSong(player: Player, scores: { 
        liked: Score; 
        theme: Score; 
    }) {
        // check if the player doesn't exist or if they've already scored
        if (!player || this.playersLockedIn.includes(player.name)) {
            return false
        }
        // lock the player in
        this.playersLockedIn.push(player.name)

        // give score to the song and the song's submitter
        player.rateSong(this.currentSong, this.currentSongSubmitter, scores)

        // if everyone (except the submitter) has scored, go to next phase
        if (this.playersLockedIn.length == this.players.length - 1) {
            this.nextPhase()
            return true
        }
        return false
    }

    guessSong(player: Player, guessData: {
        playerName: string, 
        time: number
    }) {
        if (!player || this.playersLockedIn.includes(player.name)) {
            return false
        }
        // lock the player in
        this.playersLockedIn.push(player.name)

        // if the player guessed correctly, give points
        player.guessSong(this.currentSong, this.currentSongSubmitter, guessData)
        
        // if everyone (excluding the submitter) has guessed, go to next phase
        if (this.playersLockedIn.length == this.players.length - 1) {
            this.nextPhase()
            return true
        }
        return false
    }

    getPlayerByName(name: string) {
        return this.players.find((entry) => entry.name == name)
    }

    getPlayerBySocketId(socketId: string) {
        return this.players.find((entry) => entry.socketId == socketId)
    }

    addPlayer(name: string) {
        if (!this.songsPerPerson) {
            return null
        }
        let player = new Player(name, this.songsPerPerson)
        this.players.push(player)
        return player
    }

    startSongfest(settings: { 
        songsPerPerson: number; 
        theme: string; 
        host: string; 
    }) {
        // set the settings
        this.songsPerPerson = settings.songsPerPerson
        this.theme = settings.theme
        // open the songfest
        this.songfestOpen = true
        // add the host to the list of participants
        this.host = this.addPlayer(settings.host)
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