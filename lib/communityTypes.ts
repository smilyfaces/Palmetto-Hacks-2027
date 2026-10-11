export type CommunityPhoto = {
  id: string;
  user: string;
  src?: string; // real photo URL; if missing, a colored placeholder tile is drawn
  emoji?: string;
  from?: string;
  to?: string;
};
 
export type CommunityPostData = {
  id: string; // the recipe's meal_id
  name: string;
  category: string;
  image: string;
  likes: number;
  dislikes: number;
  myVote?: -1 | 0 | 1; // this device's vote
  photos: CommunityPhoto[];
};