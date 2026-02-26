import { useEffect, useState, useRef, useCallback } from "react";
import "./PostPage.css";
import UserCard from "../../components/userCard/userCard";
import PostBox from "../../components/post/postBox";
import Post from "../../components/post/post";
import type { PosteoType } from "../../interfaces/post.ts";

const PostPage = () => {

  const [posteos, setPosteos] = useState<PosteoType[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // useCallback hace que la referencia de una función sea estable entre renders, 
  // siempre que sus dependencias no cambien.

  const loadPosteos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const url = cursor
      ? `http://localhost:3000/api/post?limit=5&cursor=${cursor}`
      : `http://localhost:3000/api/post?limit=5`;


    const res = await fetch(url, { credentials: "include" });
    const data = await res.json();

    if (data.posteos.length > 0) {
      setPosteos(prev => [...prev, ...data.posteos]);
      setCursor(data.nextCursor);
    }

    if (data.posteos.length < 5) {
      setHasMore(false);
    }

    setLoading(false);
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    loadPosteos();
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadPosteos();
      }
    }, {
      threshold: 1
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadPosteos]);


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

          {posteos.map((post, index) => {
            if (index === posteos.length - 1) {
              return (
                <div ref={lastPostRef} key={post.id}>
                  <Post post={post} />
                </div>
              );
            }
            return <Post key={post.id} post={post} />;
          })}

          {loading && <p>Cargando...</p>}
          {!hasMore && <p>No hay más posteos</p>}
        </main>

      </div>
    </div>
  );
};

export default PostPage;
