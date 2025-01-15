import { UUID } from "crypto"
import { CategoryResponse } from "./categoryResponse"

export type NoteResponse = {
    uuid: UUID
    title: string
    note: string
    created_at: Date
    archived: boolean
    categories: CategoryResponse[]
}