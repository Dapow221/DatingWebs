import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import Image from "~/components/ui/image";
  
  export const PostCard = () => {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent>
          <div className="mt-5 flex flex-col md:flex-row">
            <div className="flex-1">
              <CardHeader>
                <CardTitle>Post</CardTitle>
                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi ducimus earum eveniet ad nam! At non suscipit eos sunt delectus nostrum in ipsam vel officiis! Inventore repellat similique deserunt laudantium.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </div>
            <div className="md:mt-8 ml-6">
              <Image
                src="https://www.greenscene.co.id/wp-content/uploads/2022/09/Luffy-4.jpg"
                alt="Description of the image"
                className="h-52 w-full rounded object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  