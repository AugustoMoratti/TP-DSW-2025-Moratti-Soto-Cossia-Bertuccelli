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
          <h4>{post.user.nombre} , {post.user.apellido}</h4>
          <p>{post.user.localidad}, {post.user.provincia}</p>
        </div>
      </div>

      <div className="post-content">

        <p>
          {post.texto}
        </p>

        {post.imagenUrl && (
          <img
            src={post.imagenUrl}
            alt={'Imagen del posteo'}
            className="post-image"
          />
        )
        }

      </div>
    </div>
  );
};
//cambiar h4 y p cuando se conecte con el back

export default Post;
