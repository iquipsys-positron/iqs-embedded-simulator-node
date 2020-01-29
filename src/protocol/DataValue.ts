export class DataValue {
    public id: number;
    public val: number;

    public constructor();
    public constructor(id: number, val: number);
    public constructor(id?: number, val?: number) {
        this.id = id;
        this.val = val;
    }
}