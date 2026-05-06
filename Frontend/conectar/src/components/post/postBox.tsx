import "./post.css";
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import type { EmojiClickData } from "emoji-picker-react";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { useUser } from "../../Hooks/useUser.tsx";
import type { Posteo } from "../../interfaces/post.ts";

type PostBoxProps = {
  onPostCreated?: (post: Posteo) => void;
};

const PostBox = ({ onPostCreated }: PostBoxProps) => {
  const { user } = useUser();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendPost = async () => {
    setError("");

    if (!user?.id) {
      setError("Debes iniciar sesión para publicar.");
      return;
    }

    const texto = postText.trim();
    if (!texto) {
      setError("El texto del post no puede estar vacío.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.id,
          texto,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Error al crear el posteo.");
      }

      setPostText("");
      setShowEmojiPicker(false);

      if (onPostCreated && data.data) {
        onPostCreated(data.data as Posteo);
      }
    } catch (err: any) {
      setError(err.message || "Error de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-box">
      <input
        placeholder="Escribir una publicación"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <div className="post-actions">
        <button
          className="emoji-btn"
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <AddReactionIcon />
        </button>
        <button
          className="emoji-btn"
          type="button"
          onClick={handleSendPost}
          disabled={loading}
        >
          <SendIcon />
        </button>
      </div>
      {error && <p className="post-error">{error}</p>}
      <div className={`emoji-picker-container ${showEmojiPicker ? 'show' : ''}`}> //! No Tocas
        <EmojiPicker
          onEmojiClick={(emojiData: EmojiClickData) => {
            setPostText((prev) => prev + emojiData.emoji);
          }}
        />
      </div>
    </div>
  );
};

export default PostBox;
