import { dummyPosts } from "../../data/dummyData";
import Post from "./Post";

function Posts() {
  return (
    <div className="posts-wrapper">
      <div className="posts-container">
        {dummyPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Posts;
