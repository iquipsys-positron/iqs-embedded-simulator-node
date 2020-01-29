import { IStream } from 'iqs-libs-protocols-node';
import { Message } from './Message';

export class ErrorMessage extends Message {
    public code: number;
    public message: string;

    public constructor() {
        super(11);
    }

    public stream(stream: IStream): void {
        super.stream(stream);

        this.code = stream.streamWord(this.code);
        this.message = stream.streamString(this.message);
    }
    
}