import { Controller, Get, Post, Delete, Param, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from '../interfaces';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(): FavoritesResponse {
    return this.favoritesService.getAll();
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtist(@Param('id') id: string): void {
    return this.favoritesService.addArtist(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbum(@Param('id') id: string): void {
    return this.favoritesService.addAlbum(id);
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrack(@Param('id') id: string): void {
    return this.favoritesService.addTrack(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string): void {
    return this.favoritesService.removeArtist(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string): void {
    return this.favoritesService.removeAlbum(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string): void {
    return this.favoritesService.removeTrack(id);
  }
}
