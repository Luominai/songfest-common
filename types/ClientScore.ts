import Score from "../classes/Score";

type ExcludeMethods<T> = { 
    [K in keyof T as (T[K] extends Function ? never : K)]: T[K] 
}

export default interface ClientScore extends ExcludeMethods<Score> {

}