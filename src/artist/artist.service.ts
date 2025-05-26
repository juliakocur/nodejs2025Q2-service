import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InMemoryData } from '../data/in-memory.data';
import { Artist, Album, Track } from '../interfaces';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ArtistService {
  findAll(): Artist[] {
    return InMemoryData.artists;
  }

  findOne(id: string): Artist {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = InMemoryData.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  create(dto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: uuid(),
      name: dto.name,
      grammy: dto.grammy,
    };
    InMemoryData.artists.push(artist);
    return artist;
  }

  update(id: string, dto: UpdateArtistDto): Artist {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = InMemoryData.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    artist.name = dto.name;
    artist.grammy = dto.grammy;
    return artist;
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = InMemoryData.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }
    InMemoryData.artists.splice(index, 1);
    InMemoryData.albums.forEach((album: Album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    InMemoryData.tracks.forEach((track: Track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    InMemoryData.favorites.artists = InMemoryData.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }
}
