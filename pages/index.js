import Layout from "../components/Layout";
import PostFormCard from "../components/PostFormCard";
import PostCard from "../components/PostCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LoginPage from "./login";
import { useState, useEffect } from "react";
import { UserContextProvider } from "../contexts/usercontext";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id)
      .then((result) => {
        if (result.data.length) {
          setProfile(result.data[0]);
        }
      });
  }, [session?.user?.id]);

  const fetchPosts = () => {
    supabase
      .from("posts")
      .select("id, content, created_at, profiles(id, avatar, name)")
      .order("created_at", { ascending: false })
      .then((d) => {
        console.log(d);
        setPosts(d.data);
      });
  };

  if (!session) {
    return <LoginPage />;
  }
  return (
    <Layout>
      <UserContextProvider value={profile}>
        <PostFormCard onPost={fetchPosts} />
        {posts?.map((data) => {
          return <PostCard key={data.id} {...data} />;
        })}
      </UserContextProvider>
    </Layout>
  );
}
