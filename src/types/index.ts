export interface Post {
  createdAt: string;
  name: string;
  avatar: string;
  id: string;
  content: string;
  title: string;
}

export interface Comment {
  createdAt: string;
  name: string;
  avatar: string;
  id: string;
  content: string;
  parentId: null | string;
}

export interface CommentNode extends Comment {
  children: CommentNode[];
}
