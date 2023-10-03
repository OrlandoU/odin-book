import Academic from "./Academic"
import Group from "./Group"
import Job from "./Job"

export default interface User {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    groups: (string | Group)[],
    jobs: string[] | Job[],
    academics: string[] | Academic[],
    bio: string,
    birth_day: Date,
    birth_place: string,
    current_place: string,
    profile: string,
    cover: string,
    isOnline: boolean,
    lastActive: Date
}