import Config from "./Config.ts"
import Response from "../Type/Response.ts"
import SetValue from "../Hook/SetValue.ts"
import CheckHeader from "../Hook/CheckHeader.ts"
import CheckHeaderLogin from "../Hook/CheckHeaderLogin.ts"
import ElementSet from "./ElementSet.ts"
import Tariff from "./Tariff.ts"
import PlanetType from "../Type/Planet.ts"
import PlanetSet from "./PlanetSet.ts"
import FleetTask from "./FleetTask.ts"
import FleetTaskQueue from "./FleetTaskQueue.ts"

export default class Account {
    public id: number = NaN;
    public cookie: string = "";
    public ip: string;

    public darkmatter: number = NaN;
    public antimatter: number = NaN;
    public stardust: number = NaN;
    public container: number = NaN;

    public readonly elements: ElementSet = new ElementSet();
    public readonly planets: PlanetSet = new PlanetSet();
    public readonly fleetTasks: FleetTaskQueue = new FleetTaskQueue();

    public isValid: boolean = true;
    public isEnable: boolean = false;
    private check (): boolean {
        if (this.isEnable && this.isValid) {
            return true;
        } else {
            return false;
        }
    }
    public async login (): Promise<boolean> {
        let response: Response | undefined = await this.config.Request({
            path: "/index.php?page=login",
            method: "POST",
            body: Buffer.from(`uni=${encodeURIComponent(this.uni)}&username=${encodeURIComponent(this.name)}&password=${encodeURIComponent(this.password)}`),
            headers: [
                "Content-Type", "application/x-www-form-urlencoded",
                "Forwarded", `for=${this.ip}`,
            ],
        }, CheckHeaderLogin);
        let index: number | undefined = 0;
        let length: number | undefined = response.header.length;
        let flag: boolean | undefined = false;
        for (; index < length; index++) {
            if (response.header[index].toUpperCase() == "SET-COOKIE") {
                this.cookie = response.header[++index].split(";")[0];
                flag = true;
                break;
            }
        }
        length = undefined;
        index = undefined;
        if (flag) {
            flag = undefined;
            if (SetValue(this, "id", true, response, "Playercard(", ",")) {
                response = undefined;
                return true;
            } else {
                response = undefined;
                return false;
            }
        } else {
            flag = undefined;
            response = undefined;
            this.isValid = false;
            return false;    
        }
    }
    private async post (path: string, body: Buffer, count: number = 0): Promise<Response | undefined> {
        let response: Response | undefined = await this.config.Request({
            path: path,
            method: "POST",
            body: body,
            headers: [
                "Content-Type", "application/x-www-form-urlencoded",
                "Cookie", this.cookie,
                "Forwarded", `for=${this.ip}`,
            ],
        }, CheckHeader);
        if (response.body) {
            return response;
        } else {
            response = undefined;
            if (count < 3 && await this.login()) {
                return this.post(path, body, ++count);
            } else {
                return undefined;
            }
        }
    }
    private async get (path: string, count: number = 0): Promise<Response | undefined> {
        let response: any = await this.config.Request({
            path: path,
            method: "GET",
            body: undefined,
            headers: [
                "Cookie", this.cookie,
                "Forwarded", `for=${this.ip}`,
            ],
        }, CheckHeader);
        if (response.body) {
            return response;
        } else {
            response = undefined;
            if (count < 3 && await this.login()) {
                return this.get(path, ++count);
            } else {
                return undefined;
            }
        }
    }
    private async update (): Promise<void> {
        let response = await this.get("/game.php?page=control");
        if (response) {
            let index: any = {index: 0};
            SetValue(this, "id", true, response, "Playercard(", ",", index);
            SetValue(this, "darkmatter", true, response, 'darkmatter" name="', '"', index);
            SetValue(this, "antimatter", true, response, 'antimatter" name="', '"', index);
            SetValue(this, "stardust", true, response, 'stardust" name="', '"', index);
            SetValue(this, "container", true, response, 'container" name="', '"', index);
            let ids: Array<number> | undefined = [];
            let counts: Array<number> | undefined = [];
            let i: number | undefined = 0;
            for (; i < this.config.ControlListLength; i++) {
                SetValue(ids, i, true, response, 'gebaeude/', '.', index);
            }
            ids[9] = 921;
            ids[10] = 922;
            ids[11] = 923;
            index.index = response.body.indexOf('ipper_planets', index.index);
            for (i = 0; i < this.config.ControlListLength; i++) {
                SetValue(counts, i, true, response, 'imper_block_td">', '<', index);
            }
            this.elements.update(ids, counts, this.tariff);
            let info: [number, number, string, string, number, number] | undefined = [0, 0, "", "", 0, 0];
            while ((index.index = response.body.indexOf('class="imper_f', index.index)) > -1) {
                SetValue(info, 2, false, response, 'imper_', ' ', index);
                if (info[2] == "moon") {
                    info[0] = PlanetType.Moon;
                } else {
                    info[0] = PlanetType.Planet
                }
                SetValue(info, 1, true, response, 'overview&cp=', '"', index);
                SetValue(info, 2, false, response, '>', '<', index);
                SetValue(info, 3, false, response, '[', ']', index);
                SetValue(info, 4, true, response, 'info_text">', ' ', index);
                SetValue(info, 5, true, response, ' ', ' ', index);
                for (i = 0; i < this.config.ControlListLength; i++) {
                    SetValue(counts, i, true, response, 'imper_block_td">', '<', index);
                }
                this.planets.update(
                    ...info,
                    ids,
                    counts,
                    this.config,
                    this.tariff,
                );
            }
            info = undefined;
            i = undefined;
            counts = undefined;
            ids = undefined;
            index = undefined;
            response = undefined;
        }
        //await this.updateFleet();
    }
    public async start (): Promise<void> {
        if (!this.isEnable && this.isValid) {
            this.isEnable = true;
            while (true) {
                if (this.check()) {
                    await this.update();
                    await this.fleetTasks.run(this);
                } else {
                    return;
                }
            }
        }
    }
    public stop (): void {
        this.isEnable = false;
    }
    public async executeFleetTask (fleetTask: FleetTask): Promise<boolean> {
        let response = await this.post(`/game.php?page=fleetStep1&cp=${fleetTask.cp}`, Buffer.from(fleetTask.toString("ship")));
        if (response) {
            if (SetValue(fleetTask, "token", false, response, 'token" value="', '"')) {
                response = undefined;
                if (
                    await this.post(
                        `/game.php?page=fleetStep2&cp=${fleetTask.cp}`,
                        Buffer.from(
                            `token=${fleetTask.token}&galaxy=${fleetTask.galaxy}&system=${fleetTask.system}&planet=${fleetTask.planet}&type=${fleetTask.type}&speed=${fleetTask.speed}`
                        )
                    )
                    &&
                    (await this.post(
                        `/game.php?page=fleetStep3&cp=${fleetTask.cp}`,
                        Buffer.from(
                            `token=${fleetTask.token}&mission=${fleetTask.mission}&staytime=${fleetTask.staytime}&metal=${fleetTask.metal}&crystal=${fleetTask.crystal}&deuterium=${fleetTask.deuterium}`
                        )
                    ))?.body.includes("fleettab11")
                ) {
                    return true;
                }
            }
            response = undefined;
        }
        return false;
    }
    
    constructor (
        public uni: number,
        public name: string,
        public password: string,
        public readonly config: Config,
        public readonly tariff: Tariff,
        ip?: string
    ) {
        if (ip) {
            this.ip = ip;
        } else {
            this.ip = config.RandomIP();
        }
    }
}