import User from "./User";

export default interface Relationship {
    _id: string,
    user1_id: string | User,
    user2_id: string | User,
    sender_id: string | User,
    blocker: string | User,
    create_date: Date,
    value: number,
    request_state: 'Pending' | 'Accepted' | 'Rejected'
}

export interface RelationshipExtended {
    _id: string,
    user1_id: User,
    user2_id: User,
    sender_id: string | User,
    blocker: string | User,
    create_date: Date,
    value: number,
    request_state: 'Pending' | 'Accepted' | 'Rejected'
}

export interface RelationshipUser extends Relationship, User{
    
}