import { api } from "~/utils/api";
import HomeLayouts from "~/layouts/home-layouts";
import { Container } from "@chakra-ui/react";
import { PostCard } from "~/components/Features/Post/components/PostCard";
import { OpenModal } from "~/components/ui/modal";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession();
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  if (!session?.user) {
    return null
  }

  return (
    <HomeLayouts>
      <Container className="mt-5">
        <OpenModal createdById={session.user.id}/>
          <PostCard/>
      </Container>
    </HomeLayouts>
  );
}
