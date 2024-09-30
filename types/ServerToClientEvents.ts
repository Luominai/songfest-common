import Player from "../classes/Player"
import Song from "../classes/Song"

export default interface ServerToClientEvents {
    updateState: (state) => void
    startGame: () => void

    startProcessingSongs: () => void
    endProcessingSongs: () => void

    isThisYourSong: (yesOrNo: boolean) => void
    updateDistributions: (distribution: any) => void
    updateGameSummaryData: (data: {songs: Song[], players: Player[]}) => void
}