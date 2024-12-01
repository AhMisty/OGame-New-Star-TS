import Config from "./Config.ts"
import Tariff from "./Tariff.ts"
import Account from "./Account.ts"

export default class Operator extends Map<number, Account> {
    public readonly config: Config;
    public readonly tariff: Tariff;

    public async update (
        uni: number,
        name: string,
        password: string,
        ip?: string
    ): Promise<boolean> {
        let account: Account | undefined = new Account(uni, name, password, this.config, this.tariff, ip);
        if (await account.login()) {
            if (!this.has(account.id)) {
                this.set(account.id, account);
            }
            account = undefined;
            return true;
        }
        account = undefined;
        return false;
    }

    constructor (operator?: Operator, config?: Config) {
        super(operator);
        if (config) {
            this.config = config;
            this.tariff = new Tariff(config);
        } else {
            this.config = Config.Default;
            this.tariff = Tariff.Default;
        }
    }
}