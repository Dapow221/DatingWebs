import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Image from "~/components/ui/image";
import { api } from "~/utils/api";
import { useToast, useColorMode } from "@chakra-ui/react";
import { EditModal } from "./EditCard";
import { useState } from "react";

type PostCardProps = {
  id: number,
  title: string,
  description: string,
  createdBy: string,
  images: { url: string }[],
  datePosted: string,
  onPostUpdated?: () => Promise<void>
}


export const PostCard = (props: PostCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast()

  const { mutate: deletePost } = api.post.deletePosts.useMutation({
    onSuccess: async () => {
      toast({
        title: "Post deleted.",
        description: "Post has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      if (props.onPostUpdated) {
        await props.onPostUpdated();
      }
    },
    onError: (error) => {
      toast({
        title: "Error deleting post.",
        description: "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  });

  const onDelete = () => {
    deletePost(props.id)
  }
  
  return (
    <>
    <Card className="w-full max-w-2xl mt-2">
      <CardHeader>
        <div className="flex justify-between mb-3">
          <CardTitle>{props.title}</CardTitle>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Ellipsis className={colorMode === 'dark' ? 'text-white' : 'text-black'} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className={`
              ${colorMode === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'}
              rounded-md shadow-lg border p-1 min-w-[8rem]
            `}
          >
            <DropdownMenuItem 
              onClick={() => setIsEditModalOpen(true)}
              className={`
                ${colorMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                cursor-pointer rounded-sm px-3 py-2 text-sm
              `}
            >
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete}
              className={`
                ${colorMode === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}
                cursor-pointer rounded-sm px-3 py-2 text-sm
              `}
            >
              Delete Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <CardDescription>
          {props.description}
        </CardDescription>
      </CardHeader>
          <CardContent>
          <div className="grid grid-cols-2 gap-4 mt-2">
              {props.images?.map((image, index) => (
                <Image
                  key={index}
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="h-60 w-full rounded object-cover"
                />
              ))}
            </div>
          </CardContent>
      <CardFooter className="flex flex-col items-start text-sm">
        <div>
          <p>Posted By: {props.createdBy}</p>
        </div>
        <div>
          <p>Posted Time: {props.datePosted}</p>
        </div>
      </CardFooter>
    </Card>
    <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        postId={props.id}
        onPostUpdated={props.onPostUpdated}
      />
    </>
  );
};
