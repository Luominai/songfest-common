import Song from "../classes/Song";

export default interface ClientSong extends
Pick<Song, "url"|"startSeconds"|"endSeconds"> {

}