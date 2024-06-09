export interface BaseGtdDocument {
    id: string;
    updatedAt: number;
    createdAt: number;
    _deleted?: boolean;
}