import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InMemoryData } from '../data/in-memory.data';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../interfaces';
import { validate as isUUID } from 'uuid';

@Injectable()
export class AlbumService {
  findAll(): Album[] {
    return InMemoryData.albums;
  }

  findOne(id: string): Album {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const album = InMemoryData.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(dto: CreateAlbumDto): Album {
    if (dto.artistId && !isUUID(dto.artistId)) {
      throw new BadRequestException('Invalid artistId UUID');
    }
    if (dto.artistId) {
      const artist = InMemoryData.artists.find((a) => a.id === dto.artistId);
      if (!artist) {
        throw new NotFoundException('Artist not found');
      }
    }
    const album: Album = {
      id: uuid(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId || null,
    };
    InMemoryData.albums.push(album);
    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    if (dto.artistId && !isUUID(dto.artistId)) {
      throw new BadRequestException('Invalid artistId UUID');
    }
    if (dto.artistId) {
      const artist = InMemoryData.artists.find((a) => a.id === dto.artistId);
      if (!artist) {
        throw new NotFoundException('Artist not found');
      }
    }
    const album = InMemoryData.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId || null;
    return album;
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const index = InMemoryData.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }

    InMemoryData.albums.splice(index, 1);

    InMemoryData.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    const favIndex = InMemoryData.favorites.albums.indexOf(id);
    if (favIndex !== -1) {
      InMemoryData.favorites.albums.splice(favIndex, 1);
    }
  }
}
