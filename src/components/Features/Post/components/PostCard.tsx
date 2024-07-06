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
  createdBy: string
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
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Image
            src="https://www.greenscene.co.id/wp-content/uploads/2022/09/Luffy-4.jpg"
            alt="Image 1"
            className="h-50 w-full rounded object-cover"
          />
          <Image
            src="https://www.greenscene.co.id/wp-content/uploads/2022/09/Luffy-4.jpg"
            alt="Image 2"
            className="h-50 w-full rounded object-cover"
          />
          <Image
            src="https://www.greenscene.co.id/wp-content/uploads/2022/09/Luffy-4.jpg"
            alt="Image 3"
            className="h-50 w-full rounded object-cover"
          />
          <Image
            src="https://www.greenscene.co.id/wp-content/uploads/2022/09/Luffy-4.jpg"
            alt="Image 4"
            className="h-50 w-full rounded object-cover"
          />
        </div>
      </CardContent>
      <CardFooter>
        <p>Posted By: {props.createdBy}</p>
      </CardFooter>
    </Card>
  );
};
