import { atom } from 'recoil';

export type Post = {
  title: string;
  content: string;
  link: string;
  id : string;
  description : string;
  image_link : string;
  created_at : string;
  is_edited : boolean;
  last_edited : string;
  User : {
    _count: {
      posts: number
    },
    created_at: string,
    email: string,
    id: string,
    image_link: string,
    username: string,
}
tags : ['science','maths']
};

// Define a Recoil atom to store the posts
export const postsState = atom<Post[]>({
  key: 'postsState', // unique ID for the atom
  default: [], // initial state is an empty array
});

// Define Recoil atom for user data
export const userAtom = atom({
  key: "userAtom",
  default: null,
});


export const InsighthspostsState = atom<Post[]>({
  key: 'insightsState', // unique ID for the atom
  default: [], // initial state is an empty array
});
