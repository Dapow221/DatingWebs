import { api } from "~/utils/api";
import HomeLayouts from "~/layouts/home-layouts";
import { Container } from "@chakra-ui/react";
import { PostCard } from "~/components/Features/Post/components/PostCard";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <HomeLayouts>
      <Container className="mt-5" >
          <PostCard/>
      </Container>
    </HomeLayouts>
  );
}
