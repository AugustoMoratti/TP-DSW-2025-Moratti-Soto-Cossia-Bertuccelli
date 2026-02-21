import "./post.css";

const PostBox = () => {
  return (
    <div className="post-box">
      <input placeholder="Escribir una publicación" />
      <div className="post-actions">
        <button className="publish-btn">
          Publicar
        </button>
      </div>
    </div>
  );
};
//conectar back

export default PostBox;
