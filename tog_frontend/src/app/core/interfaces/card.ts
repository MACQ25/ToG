import { UUID } from "crypto"

export interface card {
    uuid: UUID
    name: string
    number: number
    scryfallId: UUID
    scryfallImageUrl: string
    frameEffects?: string[]
    inner_category: string
    promoTypes?:  string[]
    boosterTypes:  string[]
    otherFaceId?: UUID
    otherFace?: {
        scryfallImageUrl?: string
        frontTop?: string
        backTop?: string
        frontBot?: string
        backBot?: string
    }
    layout: string
    set: string
}