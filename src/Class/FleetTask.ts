import PlanetType from '../Type/Planet.ts'
import ElementSet from './ElementSet.ts'
import Tariff from "./Tariff.ts"
import MissionType from '../Type/Mission.ts'
import SpeedType from '../Type/Speed.ts'
import StayTime from '../Type/StayTime.ts'

export default class FleetTask extends ElementSet {
    public readonly id: string = crypto.randomUUID();
    public token: string = "";
    public nextTime: number = Date.now();
    public isEnable: boolean = true;

    constructor (
        public cp: number,
        public galaxy: number,
        public system: number,
        public planet: number,
        public type: PlanetType,
        public mission: MissionType,
        public speed: SpeedType,
        public staytime: StayTime,
        public metal: number,
        public crystal: number,
        public deuterium: number,
        ids: number[],
        counts: number[],
        public timeout: number,
        tariff: Tariff,
    ) {
        super(ids, counts, tariff);
    }
}