import { Attendees } from "types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserList = ({
  title,
  description,
  users,
}: {
  title: string;
  description: string;
  users: Attendees[];
}) => {
  function generateRandomColor() {
    const red1 = Math.floor(Math.random() * 256);
    const green1 = Math.floor(Math.random() * 256);
    const blue1 = Math.floor(Math.random() * 256);
    const red2 = Math.floor(Math.random() * 256);
    const green2 = Math.floor(Math.random() * 256);
    const blue2 = Math.floor(Math.random() * 256);

    const gradient = `linear-gradient(to bottom, rgb(${red1}, ${green1}, ${blue1}), rgb(${red2}, ${green2}, ${blue2}))`;
    return gradient;
  }

  return (
    <div>
      <div>
        <div className="font-bold uppercase">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      {users.length === 0 && (
        <p className="mt-1 text-sm text-gray-600">No Data Available...</p>
      )}
      <div className="container grid grid-cols-7 sm:grid-cols-8 md:grid-cols-9 gap-x-0 py-4">
        {users.slice(0, 17).map((user: Attendees, index: number) => (
          <AspectRatio ratio={1} key={index}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback
                style={{
                  background: generateRandomColor(),
                }}
              />
            </Avatar>
          </AspectRatio>
        ))}

        {users.length > 17 && (
          <AspectRatio ratio={1}>
            <Avatar className="h-[41px] w-[41px] bg-slate-800">
              <AvatarFallback
                className={users.length > 99 ? "text-[10px]" : "text-sm"}
              >
                +{users.length - 17}
              </AvatarFallback>
            </Avatar>
          </AspectRatio>
        )}
      </div>
    </div>
  );
};

export default UserList;
