export class Profile {
    id!: number;
    createdAt!: string;
    updatedAt!: string;
    user: User | undefined ;
    userId: number | undefined;
    bio!: string;
}

export class User {
    id!: number;
    createdAt!: string;
    updatedAt!: string;
    username!: string;
    email!: string;
    profile: Profile | undefined;
    blogs: (Blog | null)[] | undefined;
    blogPosts: BlogPost[] | undefined
    blogComments: BlogComment[] | undefined
}

export class Blog {
    id!: number;
    createdAt!: string;
    updatedAt!: string;
    author: User | undefined;
    authorId: number | undefined;
    name!: string;
    description!: string;
}

export class BlogPost {
    id!: number;
    createdAt!: string;
    updatedAt!: string;
    author: User | undefined;
    authorId: number | undefined;
    title!: string;
    content!: string;
    published!: boolean;
    blog: Blog | undefined;
    blogId: number | undefined;
    blogComments: BlogComment[] | undefined;
}

export class BlogComment {
    id!: number;
    createdAt!: string;
    updatedAt!: string;
    blogPost: BlogPost | undefined;
    blogPostId: number | undefined;
    content!: string;
    parent: BlogComment | undefined | null;
    parentId: number | undefined | null;
    blogComments: BlogComment[] | undefined;
}