export interface Story {
  id: string;
  name: string;
  avatar: string;
  stories: {
    id: string;
    image: string;
    caption: string;
  }[];
}