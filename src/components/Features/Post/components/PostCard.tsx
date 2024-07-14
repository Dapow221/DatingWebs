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
import { propNames, useToast } from "@chakra-ui/react";

type PostCardProps = {
  id: number,
  title: string,
  description: string,
  createdBy: string,
  images: { url: string }[],
  datePosted: string
}

export const PostCard = (props: PostCardProps) => {
  const toast = useToast()
  const { mutate: deletePost } = api.post.deletePosts.useMutation({
    onSuccess: () => {
      toast({
        title: "Post deleted.",
        description: "Please refresh your browser.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },

    onError: (error) => {
      toast({
        title: "Error creating post.",
        description: "Ups!! Something Wrong...",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log(error)
    }
  })

  const onDelete = () => {
    deletePost(props.id)
  }
  
  return (
    <Card className="w-full max-w-2xl mt-2">
      <CardHeader>
        <div className="flex justify-between mb-3">
          <CardTitle>{props.title}</CardTitle>
          <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
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
  );
};
