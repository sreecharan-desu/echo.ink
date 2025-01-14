import { atom } from 'recoil';

export interface Post {
  id: string;
  title: string;
  description: string;
  created_at: string;
  image_link?: string;
  tags?: string[];
  User: {
    username: string;
    image_link?: string;
    id: string;
    _count?: {
      posts: number;
    };
  };
}

export interface User {
  id: string;
  username: string;
  email?: string;
  image_link?: string;
  created_at: string;
  posts: Post[];
  _count: {
    posts: number;
  };
}

export const userAtom = atom<User | null>({
  key: "userAtom",
  default: null,
});

export const postsState = atom<Post[]>({
  key: "postsState",
  default: [],
});

export const InsighthspostsState = atom<Post[]>({
  key: "InsighthspostsState",
  default: [],
});
