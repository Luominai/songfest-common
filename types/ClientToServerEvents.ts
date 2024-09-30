import Player from "../classes/Player";
import ClientScore from "./ClientScore";

export default interface ClientToServerEvents {
    getState: () => void
    getPlayerByName: (name: string) => void

    cancelSongfest: () => void

    submitSongs: (data: Player) => void

    startSongfest: (settings: {
        songsPerPerson: number
        theme: string
        host: string
    }) => void
    startGame: () => void

    nextPhase: () => void

    updateSocket: (playerName: string) => void
    rateSong: (score: {
        liked: ClientScore
        theme: ClientScore
    }) => void
    guessSongSubmitter: (guess: {playerName: string, time: number}) => void

    isThisMySong: () => void
    getDistributions: (ratingOrGuessing: "rating" | "guessing") => void
    getGameSummaryData: () => void

    reset: () => void
}