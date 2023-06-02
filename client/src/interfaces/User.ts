import Group from "./Group"

export default interface User {
    _id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    groups: string[] | Group[],
    jobs: string[],
    academics: string[],
    bio: string,
    birth_day: Date,
    birth_place: string,
    current_place: string,
    profile: string,
    cover: string,
    isOnline: boolean,
    lastActive: Date
}