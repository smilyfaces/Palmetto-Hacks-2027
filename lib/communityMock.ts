// Sample data for the community page layout. Replace with database results later.
 
export type CommunityPhoto = {
  id: string;
  user: string;
  src?: string; // a real photo URL, once users can upload
  emoji: string; // placeholder shown when there's no src
  from: string; // placeholder gradient colors
  to: string;
};
 
export type CommunityPostData = {
  id: string;
  name: string;
  category: string;
  image: string; // the recipe's own thumbnail
  likes: number;
  dislikes: number;
  photos: CommunityPhoto[];
};
 
export const COMMUNITY_POSTS: CommunityPostData[] = [
  {
    id: "52771",
    name: "Spicy Arrabiata Penne",
    category: "Vegetarian",
    image: "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
    likes: 412,
    dislikes: 9,
    photos: [
      { id: "p1", user: "maria_cooks", emoji: "🍝", from: "#f5d98b", to: "#e8a87c" },
      { id: "p2", user: "dev.eats", emoji: "🌶️", from: "#f2c6b4", to: "#d98880" },
      { id: "p3", user: "jess", emoji: "🧄", from: "#cbd6ca", to: "#83a98b" },
      { id: "p4", user: "chefmike", emoji: "🍝", from: "#f5d98b", to: "#c9a54a" },
    ],
  },
  {
    id: "52772",
    name: "Teriyaki Chicken Casserole",
    category: "Chicken",
    image: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    likes: 268,
    dislikes: 31,
    photos: [
      { id: "p1", user: "ana", emoji: "🍗", from: "#e8a87c", to: "#9c5a3c" },
      { id: "p2", user: "chefmike", emoji: "🍚", from: "#cbd6ca", to: "#557060" },
      { id: "p3", user: "tom_t", emoji: "🥦", from: "#83a98b", to: "#193c2d" },
    ],
  },
  {
    id: "52959",
    name: "Baked Salmon with Fennel & Tomatoes",
    category: "Seafood",
    image: "https://www.themealdb.com/images/media/meals/1548772327.jpg",
    likes: 187,
    dislikes: 74,
    photos: [
      { id: "p1", user: "jess", emoji: "🐟", from: "#f2c6b4", to: "#d98880" },
      { id: "p2", user: "ana", emoji: "🍅", from: "#f5d98b", to: "#e8a87c" },
    ],
  },
  {
    id: "mock-4",
    name: "Beef and Mustard Pie",
    category: "Beef",
    image: "",
    likes: 96,
    dislikes: 58,
    photos: [
      { id: "p1", user: "tom_t", emoji: "🥧", from: "#e8a87c", to: "#9c5a3c" },
      { id: "p2", user: "dev.eats", emoji: "🥩", from: "#d98880", to: "#7a3b36" },
      { id: "p3", user: "maria_cooks", emoji: "🥔", from: "#f5d98b", to: "#c9a54a" },
    ],
  },
  {
    id: "mock-5",
    name: "Apple Frangipan Tart",
    category: "Dessert",
    image: "",
    likes: 154,
    dislikes: 12,
    photos: [
      { id: "p1", user: "ana", emoji: "🍎", from: "#f2c6b4", to: "#d98880" },
      { id: "p2", user: "jess", emoji: "🥧", from: "#f5d98b", to: "#e8a87c" },
      { id: "p3", user: "chefmike", emoji: "🍰", from: "#cbd6ca", to: "#83a98b" },
      { id: "p4", user: "tom_t", emoji: "🍎", from: "#e8a87c", to: "#9c5a3c" },
      { id: "p5", user: "dev.eats", emoji: "☕", from: "#cbd6ca", to: "#557060" },
    ],
  },
  {
    id: "mock-6",
    name: "Chicken Handi",
    category: "Chicken",
    image: "",
    likes: 61,
    dislikes: 83,
    photos: [
      { id: "p1", user: "dev.eats", emoji: "🍛", from: "#f5d98b", to: "#c9a54a" },
      { id: "p2", user: "maria_cooks", emoji: "🌶️", from: "#f2c6b4", to: "#d98880" },
    ],
  },
];