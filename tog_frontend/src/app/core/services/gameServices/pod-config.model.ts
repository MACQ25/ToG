import moment, { Moment } from 'moment';
import { Set } from '../../../core/interfaces/set';


// ENUMS used to maintain the logic of our form

export const Mode = { 
    Progression: 1, League: 2, Constructed: 3, Custom: 4 
} as const;

export const ProgressionStart = {
  OldSchool: 1, ProTour: 2, Year1999: 3, Modern: 4, SpecificSet: 5,
} as const;

export const ConstructedFormat = { 
    T2: 1, BlockConstructed: 2 
} as const;

export type TertiaryKind = 'members' | 'standard' | 'block' | null;


// Options hidden behind the "advanced" toggle in the standard sub-form
export interface AdvancedStndOptions {
    displayRotated: boolean;
    csBehavior: number;
    rDate: number;
}

export interface StandardOptions {
    range: number; 
    year: number; 
    options: AdvancedStndOptions;
}


// "tertiary" can currently be one of two things, based on how `chosen` reads it:
//  1. an explicit list of sets (form.tertiary.members)
//  2. a date range to look sets up by (form.tertiary.year / range / options)
export type Tertiary =
    | { kind: 'target'; target: Set}
    | { kind: 'members'; members: Set[] }
    | { kind: 'standard'; range: number; year: Moment; options: AdvancedStndOptions };


export interface ExchangeOptions {
    tradingPlayers: boolean;
    tradingBots: boolean;
    ante: boolean;
}

// One complete saved pod config
export interface PodConfig {
    mode: number;               // form: main.primary (1, 2, or 3)
    secondary: number | null;   // form: main.secondary
    tertiary: Tertiary | null;  // form: main.tertiary
    cardPool: number;           // form: cardPool
    exchange: ExchangeOptions;  // form: exchange (all false if the radio disables it)
}
