import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import HomeLayouts from "~/layouts/home-layouts";
import { Container, Select, Flex, Box } from "@chakra-ui/react";
import { PostCard } from "~/components/Features/Post/components/PostCard";
import { OpenModal } from "~/components/ui/modal";
import { useSession } from "next-auth/react";
import { parse } from "date-fns";

type Image = {
  id: number;
  url: string;
  postId: number;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
};

type Post = {
  id: number;
  title: string;
  description: string;
  images: Image[];
  createdBy: User;
  datePosted: string;
  createdById: string;
  couplesId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Home() {
  const { data: session } = useSession();
  const { data: posts } = api.post.getUserPosts.useQuery();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (posts) {
      const filtered = posts.filter(post => {
        const postDate = parse(post.datePosted, 'dd/MM/yyyy', new Date());
        return postDate.getMonth() + 1 === selectedMonth && postDate.getFullYear() === selectedYear;
      });
      setFilteredPosts(filtered);
    }
  }, [posts, selectedMonth, selectedYear]);

  if (!session?.user) {
    return null;
  }

  return (
    <HomeLayouts>
      <Container className="mt-5">
        <OpenModal createdById={session.user.id} />
        <Flex mb={5} align="center">
          <Box className="mr-2">
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              placeholder="Select month"
            >
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {new Date(0, index).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              placeholder="Select year"
            >
              {[...Array(10)].map((_, index) => (
                <option key={index} value={new Date().getFullYear() - index}>
                  {new Date().getFullYear() - index}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
        {filteredPosts.map((post) => {
          const createdBy =
            typeof post.createdBy === "object" ? post.createdBy.name : post.createdBy;

          return (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              createdBy={createdBy as string}
              images={post.images}
              datePosted={post.datePosted}
            />
          );
        })}
      </Container>
    </HomeLayouts>
  );
}
