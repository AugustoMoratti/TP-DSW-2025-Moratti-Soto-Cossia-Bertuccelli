import "./post.css";
import type { PosteoType } from "../../interfaces/post.ts";

type PostProps = {
  post: PosteoType;
};

const Post = ({ post }: PostProps) => {
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="avatarrr" />
        <div>
          <h4>Apellido, Nombre</h4>
          <p>Localidad, Provincia</p>
        </div>
      </div>

      <div className="post-content">
        <p>
          Para entender la historia de Five Nights at Freddy's hay que olvidarse
          que estos son juegos y tomarlos como ciencia ficción.
        </p>
        <div className="post-image" />
      </div>
    </div>
  );
};
//cambiar h4 y p cuando se conecte con el back

export default Post;
