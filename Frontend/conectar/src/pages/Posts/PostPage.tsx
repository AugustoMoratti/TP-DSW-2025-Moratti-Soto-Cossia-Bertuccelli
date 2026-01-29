import "./postPage.css";
import UserCard from "../../components/userCard/userCard";
import PostBox from "../../components/post/postBox";
import Post from "../../components/post/post";

const PostPage = () => {
  return (
    <div className="post-page">
      <div className="post-layout">

        <aside className="sidebarr">
          <UserCard />
          <h3 className="sidebarr-title">¡Perfiles que te pueden interesar!</h3>
          <UserCard small />
          <UserCard small />
          <UserCard small />
        </aside>

        <main className="feedd">
          <PostBox />
          <Post />
          <Post />
        </main>

      </div>
    </div>
  );
};
//conectar el backend para darle a post y usercard datos reales. ver donde ubicar la pagina, si luego del login o donde

export default PostPage;
