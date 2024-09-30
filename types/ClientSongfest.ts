import Songfest from "../classes/Songfest";

export default interface ClientSongfest extends
Omit<Songfest, "game"> {

}