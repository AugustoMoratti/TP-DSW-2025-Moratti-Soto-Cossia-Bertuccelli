import "./post.css";
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import type { EmojiClickData } from "emoji-picker-react";
import AddReactionIcon from '@mui/icons-material/AddReaction';

const PostBox = () => {

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postText, setPostText] = useState("");
  
  return (
    <div className="post-box">
      <input placeholder="Escribir una publicación" value={postText} onChange={(e) => setPostText(e.target.value)} />
      <div className="post-actions">
        <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)} >
          <AddReactionIcon />
        </button>
        <button className="emoji-btn">
          <SendIcon />
        </button>
      </div>
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
