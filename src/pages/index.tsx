import { api } from "~/utils/api";
import HomeLayouts from "~/layouts/home-layouts";
import { Container } from "@chakra-ui/react";
import { PostCard } from "~/components/Features/Post/components/PostCard";
import { OpenModal } from "~/components/ui/modal";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { data: posts } = api.post.getUserPosts.useQuery()

  if (!session?.user) {
    return null
  }

  return (
    <HomeLayouts>
      <Container className="mt-5">
        <OpenModal createdById={session.user.id}/>
        {
          posts?.map(post => {
            const createdBy = typeof post.createdBy === 'object' ? post.createdBy.name : post.createdBy;

            return (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                createdBy={createdBy as string}
                images={post.images}
              />
            );
          })
        }
      </Container>
    </HomeLayouts>
  );
}
