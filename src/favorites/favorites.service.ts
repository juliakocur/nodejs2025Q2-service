import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InMemoryData } from '../data/in-memory.data';
import { FavoritesResponse } from '../interfaces';
import { validate as isUUID } from 'uuid';

@Injectable()
export class FavoritesService {
  getAll(): FavoritesResponse {
    return {
      artists: InMemoryData.favorites.artists
        .map((id) => InMemoryData.artists.find((a) => a.id === id))
        .filter((artist) => artist !== undefined),
      albums: InMemoryData.favorites.albums
        .map((id) => InMemoryData.albums.find((a) => a.id === id))
        .filter((album) => album !== undefined),
      tracks: InMemoryData.favorites.tracks
        .map((id) => InMemoryData.tracks.find((t) => t.id === id))
        .filter((track) => track !== undefined),
    };
  }

  addArtist(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = InMemoryData.artists.find((a) => a.id === id);
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    if (!InMemoryData.favorites.artists.includes(id)) {
      InMemoryData.favorites.artists.push(id);
    }
  }

  addAlbum(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const album = InMemoryData.albums.find((a) => a.id === id);
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    if (!InMemoryData.favorites.albums.includes(id)) {
      InMemoryData.favorites.albums.push(id);
    }
  }

  addTrack(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = InMemoryData.tracks.find((t) => t.id === id);
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }
    if (!InMemoryData.favorites.tracks.includes(id)) {
      InMemoryData.favorites.tracks.push(id);
    }
  }

  removeArtist(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = InMemoryData.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist not found in favorites');
    }
    InMemoryData.favorites.artists.splice(index, 1);
  }

  removeAlbum(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = InMemoryData.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album not found in favorites');
    }
    InMemoryData.favorites.albums.splice(index, 1);
  }

  removeTrack(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = InMemoryData.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track not found in favorites');
    }
    InMemoryData.favorites.tracks.splice(index, 1);
  }
}
