import { UUID } from "crypto"

export type ModifyCategoryRequest = {
    noteUUID: UUID
    categoryUUIDs: UUID[]
}