export interface Video {
    id: string;
    user_id: string;
    name: string;
    duration: number;
    size: number;
    thumbnail_url: string;
    playlist_url: string;
    orientation: "portrait" | "landscape";
    aspect_ratio: string;
    attempts: number;
    attempts_exhausted: boolean;
    converted_percentage: number;
    converted_at: string;
    created_at: string;
    updated_at: string;
}

export interface Routine {
    id: string;
    exercise_id: string;
    set_id: string;
    position: number;
    name: string;
    repetitions: number;
    duration: number;
    rest: number;
    created_at: string;
    updated_at: string;
    video: Video;
}

export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string;
    profile_photo_url: string;
    about: string;
    country: string;
    gender: "male" | "female" | "other";
    unit: "metric" | "imperial";
    weight: number;
    age: number;
    height: number;
    roles: string[];
    permissions: string[];
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

export interface Workout {
    id: string;
    trainer_id: string;
    trainer_name: string;
    type: "sets_reps" | "circuit" | "time_based" | "other"; // Possible types inferred
    status: "approved" | "pending" | "rejected";
    name: string;
    description: string;
    difficulty: number;
    is_favorite: boolean;
    total_duration: number;
    approved_at: string;
    published_at: string;
    created_at: string;
    updated_at: string;
    user: User;
    // video_cover: VideoCover;
    routines: Routine[];
}
