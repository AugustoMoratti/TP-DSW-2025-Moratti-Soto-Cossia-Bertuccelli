import "./post.css";
import type { Posteo } from "../../interfaces/post.ts";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlagIcon from '@mui/icons-material/Flag';
import { useReaccion } from "../../Hooks/useReaccion.ts";

type PostProps = {
  post: Posteo;
  userId: string; // ID del usuario logueado, pasalo desde el componente padre
};

const Post = ({ post, userId }: PostProps) => {
  const fotoSrc = post.user.fotoUrl
    ? `http://localhost:3000${post.user.fotoUrl}`
    : "/default-avatar.png";

  const { likes, dislikes, reaccionUsuario, loading, reaccionar } =
    useReaccion(String(post.id), userId);

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-header-left">
          <img
            src={fotoSrc}
            alt={"Foto de perfil del usuario"}
            className="post-avatar"
          />
          <div className="post-header-info">
            <h4>{post.user.nombre}, {post.user.apellido}</h4>
            <p>{post.user.localidad}, {post.user.provincia}</p>
          </div>
        </div>
      </div>

      <div className="post-content">
        <p>{post.texto}</p>
        {post.imagenUrl && (
          <img
            src={post.imagenUrl}
            alt={"Imagen del posteo"}
            className="post-image"
          />
        )}
      </div>

      <div className="post-actions">
        <button
          type="button"
          className={`post-action-btn ${reaccionUsuario === "like" ? "post-action-btn--active" : ""}`}
          title="Like"
          onClick={() => reaccionar("like")}
          disabled={loading}
        >
          <ThumbUpIcon fontSize="small" />
          <span className="post-action-count">{likes}</span>
        </button>

        <button
          type="button"
          className={`post-action-btn ${reaccionUsuario === "dislike" ? "post-action-btn--active-dislike" : ""}`}
          title="Dislike"
          onClick={() => reaccionar("dislike")}
          disabled={loading}
        >
          <ThumbDownIcon fontSize="small" />
          <span className="post-action-count">{dislikes}</span>
        </button>

        <button type="button" className="post-action-btn" title="Favoritos">
          <FavoriteIcon fontSize="small" />
        </button>
        <button
          type="button"
          className="post-action-btn post-action-btn--warn"
          title="Denunciar"
        >
          <FlagIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default Post;