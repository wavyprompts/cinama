
export type Category = 'kdrama' | 'kmovie' | 'hdrama' | 'hmovie' | 'bdrama' | 'bmovie' | 'cdrama' | 'anime';

export type Status = 'watching' | 'completed' | 'plan-to-watch' | 'on-hold' | 'dropped';

export interface WatchItem {
    id: string;
    category: Category;
    title: string;
    year: number;
    poster: string;
    myRating: number;
    episodes: number;
    episodesWatched: number;
    status: Status;
    genres: string[];
    watchLink: string;
    trailerUrl?: string;
    dateAdded: string;
    lastUpdated: string;
    favorite: boolean;
}

export interface CategoryInfo {
    id: Category;
    name: string;
    color: string;
    gradient: string;
    path: string;
}
