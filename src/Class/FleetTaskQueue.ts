import Account from './Account.ts'
import FleetTask from './FleetTask.ts'
import PlanetType from '../Type/Planet.ts'
import Tariff from "./Tariff.ts"
import MissionType from '../Type/Mission.ts'
import SpeedType from '../Type/Speed.ts'
import StayTime from '../Type/StayTime.ts'

export default class FleetTaskQueue extends Array<FleetTask> {
    public add (
        cp: number,
        galaxy: number,
        system: number,
        planet: number,
        type: PlanetType,
        mission: MissionType,
        speed: SpeedType,
        staytime: StayTime,
        metal: number,
        crystal: number,
        deuterium: number,
        ids: number[],
        counts: number[],
        timeout: number,
        tariff: Tariff,
    ): void {
        this.addTask(new FleetTask(cp, galaxy, system, planet, type, mission, speed, staytime, metal, crystal, deuterium, ids, counts, timeout, tariff));
    }
    private addTask (fleetTask: FleetTask): void {
        let nextTime: number | undefined = fleetTask.nextTime;
        let index: number | undefined = 0;
        for (; index < this.length; index++) {
            if (this[index].nextTime > nextTime) {
                this.splice(index, 0, fleetTask);
                index = undefined;
                nextTime = undefined;
                return;
            }
        }
        index = undefined;
        nextTime = undefined;
        this.push(fleetTask);
        return;
    }
    public delete (id: string): boolean {
        let index: number | undefined = 0;
        for (; index < this.length; index++) {
            if (this[index].id == id) {
                this.splice(index, 1);
                index = undefined;
                return true;
            }
        }
        index = undefined;
        return false;
    }
    public disable (id: string): boolean {
        let index: number | undefined = 0;
        for (; index < this.length; index++) {
            if (this[index].id == id) {
                this[index].isEnable = false;
                return true;
            }
        }
        index = undefined;
        return false;
    }
    public enable (id: string): boolean {
        let index: number | undefined = 0;
        for (; index < this.length; index++) {
            if (this[index].id == id) {
                this[index].isEnable = true;
                return true;
            }
        }
        index = undefined;
        return false;
    }
    public async run (account: Account): Promise<void>{
        let time: number | undefined = Date.now();
        let index: number | undefined = 0;
        let task: FleetTask | undefined;
        for (; index < this.length; index++) {
            if (this[index].nextTime <= time && this[index].isEnable) {
                await account.executeFleetTask(this[index]);
                task = this.splice(index--, 1)[0];
                task.nextTime = Date.now() + task.timeout;
                this.addTask(task);
            } else {
                break;
            }
        }
        task = undefined;
        index = undefined;
        time = undefined;
    }
}