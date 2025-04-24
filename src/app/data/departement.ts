import * as zod from 'zod';

export interface Departement {
    readonly nom: string;
    readonly code: string;
    readonly codeRegion: string;
}

export const DepartementSchema = zod.object({
    nom: zod.string(),
    code: zod.string(),
    codeRegion: zod.string()
}).readonly();

export const DepartementsSchema = zod.array(DepartementSchema).readonly();
