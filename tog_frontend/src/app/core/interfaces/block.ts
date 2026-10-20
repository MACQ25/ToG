import { Set } from './set'

export interface Block extends Set {
    members: Set[] 
}
