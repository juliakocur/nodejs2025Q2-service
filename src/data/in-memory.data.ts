import { User, Artist, Track, Album, Favorites } from '../interfaces';

export class InMemoryData {
  static users: User[] = [];
  static artists: Artist[] = [];
  static tracks: Track[] = [];
  static albums: Album[] = [];
  static favorites: Favorites = { artists: [], albums: [], tracks: [] };
}
