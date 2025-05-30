import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InMemoryData } from '../data/in-memory.data';
import { Track } from '../interfaces';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class TrackService {
  findAll(): Track[] {
    return InMemoryData.tracks;
  }

  findOne(id: string): Track {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = InMemoryData.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(dto: CreateTrackDto): Track {
    const track: Track = {
      id: uuid(),
      name: dto.name,
      artistId: dto.artistId || null,
      albumId: dto.albumId || null,
      duration: dto.duration,
    };
    InMemoryData.tracks.push(track);
    return track;
  }

  update(id: string, dto: UpdateTrackDto): Track {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = InMemoryData.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    track.name = dto.name;
    track.artistId = dto.artistId || null;
    track.albumId = dto.albumId || null;
    track.duration = dto.duration;
    return track;
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = InMemoryData.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }
    InMemoryData.tracks.splice(index, 1);
    // Remove from favorites
    InMemoryData.favorites.tracks = InMemoryData.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }
}
