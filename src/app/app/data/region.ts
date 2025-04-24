import * as zod from 'zod';

export interface Region {
    readonly nom: string;
    readonly code: string;
}

export const RegionSchema = zod.object({
    nom: zod.string(),
    code: zod.string()
}).readonly();
