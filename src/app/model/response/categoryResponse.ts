import { UUID } from "crypto"

export type CategoryResponse = {
    uuid: UUID
    name: string
    //notes: NoteResponse[]
}