import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import HomeLayouts from "~/layouts/home-layouts";
import { 
  Container, 
  Select, 
  Flex, 
  Box, 
  Spinner, 
  Text,
  Center,
  VStack 
} from "@chakra-ui/react";
import { PostCard } from "~/components/Features/Post/components/PostCard";
import { OpenModal } from "~/components/ui/modal";
import { useSession } from "next-auth/react";
import { parse, isValid } from "date-fns";
import HomePage from "~/layouts/home-page";

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
  datePosted: any;
  createdById: string;
  couplesId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Home() {
  const { data: session, status: sessionStatus } = useSession();
  const utils = api.useContext();

  const { 
    data: posts, 
    isLoading: postsLoading
  } = api.post.getUserPosts.useQuery(undefined, {
    enabled: !!session?.user,
    refetchOnWindowFocus: false
  });

  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (posts) {
      const filtered = posts.filter(post => {
        const postDate = parse(post.datePosted as string, 'dd/MM/yyyy', new Date());
        if (!isValid(postDate)) return false;

        if (selectedMonth === null) {
          return postDate.getFullYear() === selectedYear;
        }
        
        return postDate.getMonth() + 1 === selectedMonth && 
               postDate.getFullYear() === selectedYear;
      });
      setFilteredPosts(filtered);
    }
  }, [posts, selectedMonth, selectedYear]);

  if (sessionStatus === "loading") {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!session?.user) {
    return <HomePage />;
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMonth(value === "" ? null : parseInt(value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const invalidatePostsData = async () => {
    await utils.post.getUserPosts.invalidate();
  };

  return (
    <HomeLayouts>
      <Container className="mt-5">
        <OpenModal 
          createdById={session.user.id} 
          onSuccess={invalidatePostsData}
        />
        
        <Flex mb={5} align="center" gap={2}>
          <Box flex={1}>
            <Select
              value={selectedMonth?.toString() ?? ""}
              onChange={handleMonthChange}
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {new Date(0, index).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Select>
          </Box>
          <Box flex={1}>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
            >
              {[...Array(10)].map((_, index) => (
                <option key={index} value={new Date().getFullYear() - index}>
                  {new Date().getFullYear() - index}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>

        {postsLoading ? (
          <Center py={10}>
            <VStack spacing={4}>
              <Spinner size="xl" />
              <Text>Loading ...</Text>
            </VStack>
          </Center>
        ) : filteredPosts.length === 0 ? (
          <Center py={10}>
            <Text fontSize="lg" color="gray.500">
              No posts found for the selected period
            </Text>
          </Center>
        ) : (
          <VStack spacing={4} align="stretch">
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
                  onPostUpdated={invalidatePostsData}
                />
              );
            })}
          </VStack>
        )}
      </Container>
    </HomeLayouts>
  );
}