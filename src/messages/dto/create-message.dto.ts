import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateMessageDto {

    @IsMongoId()
    from: string;

    @IsMongoId()
    to: string;

    @IsNotEmpty()
    message: string;
}
