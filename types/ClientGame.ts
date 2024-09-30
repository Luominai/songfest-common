import Game from "../classes/Game"

export default interface ClientGame extends 
Omit<Game, "submitter"> {
    
}