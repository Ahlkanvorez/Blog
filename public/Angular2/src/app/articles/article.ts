export class Article {
  _id: number;
  title: string;
  author: { name: string; email: string; };
  date: Date;
  category: string;
  content: string;
  sticky: boolean;
  image: string;
  image_dimensions: { width: number, height: number };
}
