import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID('4', { each: true })
  @IsOptional()
  artistId: string | null;

  @IsUUID('4', { each: true })
  @IsOptional()
  albumId: string | null;

  @IsInt()
  duration: number;
}
