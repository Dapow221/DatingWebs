import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "~/components/ui/image";

type PostCardProps = {
  id: string,
  title: string,
  description: string,
  createdBy: string,
  images: { url: string }[]
}

export const PostCard = (props: PostCardProps) => {
  
  return (
    <Card className="w-full max-w-2xl mt-2">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
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
              className="h-50 w-full rounded object-cover"
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p>Posted By: {props.createdBy}</p>
      </CardFooter>
    </Card>
  );
};
