import { atom } from 'recoil';

export interface Post {
  id: string;
  title: string;
  description: string;
  created_at: string;
  image_link: string | null;
  is_edited: boolean;
  last_edited: string | null;
  tags: string[];
  User: {
    id: string;
    username: string;
    email: string;
    created_at: string;
    image_link: string | null;
    _count: {
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
