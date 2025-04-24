import * as zod from 'zod';

export interface Commune {
    readonly nom: string; 
    readonly code: string;
    readonly codesPostaux: readonly string[];
    readonly siren: string;
    readonly codeEpci: string;
    readonly codeDepartement: string;
    readonly codeRegion: string;
    readonly population: number;
}

export const CommuneSchema = zod.object({
    nom: zod.string(),
    code: zod.string(),
    codesPostaux: zod.array(zod.string()).readonly(),
    siren: zod.string(),
    codeEpci: zod.string(),
    codeDepartement: zod.string(),
    codeRegion: zod.string(),
    population: zod.number()
}).readonly();
