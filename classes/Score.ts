export default class Score {
    low: number
    mid: number
    high: number
    total: number
    
    constructor(low?: number, mid?: number, high?: number) {
        this.low = low ?? 0
        this.mid = mid ?? 0
        this.high = high ?? 0
        this.total = this.low + this.mid + this.high
    }

    add(score: Score | Omit<Score, "total">) {
        Object.entries(score).map(([key, value]) => {
            this[key] += value
        })
    }
    
}