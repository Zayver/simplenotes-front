import { UUID } from "crypto"

export type CreateNoteRequest = {
    title: string
    note: string
    categories: UUID[]
}