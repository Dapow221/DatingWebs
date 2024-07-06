import { api } from "~/utils/api";
import HomeLayouts from "~/layouts/home-layouts";
import { Container } from "@chakra-ui/react";
import { PostCard } from "~/components/Features/Post/components/PostCard";
import { OpenModal } from "~/components/ui/modal";
import { useSession } from "next-auth/react";

type UserPageProps = {
  id: string,
  title: string,
  description: string,
  createdBy: string
}


export default function Home(props: UserPageProps) {
  const { data: session } = useSession();
  const { data: posts } = api.post.getUserPosts.useQuery(session?.user.id)

  if (!session?.user) {
    return null
  }

  return (
    <HomeLayouts>
      <Container className="mt-5">
        <OpenModal createdById={session.user.id}/>
         {
          posts?.map(post => {
            return  <PostCard
            id={post.id}
            title={post.title}
            description={post.description}
            createdBy={post.createdById}
            />
          })
         }
      </Container>
    </HomeLayouts>
  );
}
