import { Attendees } from "@/types";
import { AspectRatio } from "@/app/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

const SupportersList = ({
  title,
  description,
  supporters,
  selectedEvent,
  eventContract,
  user,
}: {
  title: string;
  description: string;
  supporters: Attendees[];
  selectedEvent: string | undefined;
  eventContract: string | null;
  user?: string | null;
}) => {
  let event;
  let contract;

  function generateColorFromAddress(address: string) {
    if (address.startsWith("0x")) {
      address = address.slice(2);
    }
    const colorHex = address.slice(-6);
    const colorHex2 = address.slice(-12, -6);
    const red = parseInt(colorHex.slice(0, 2), 16);
    const green = parseInt(colorHex.slice(2, 4), 16);
    const blue = parseInt(colorHex.slice(4, 6), 16);
    const red2 = parseInt(colorHex2.slice(0, 2), 16);
    const green2 = parseInt(colorHex2.slice(2, 4), 16);
    const blue2 = parseInt(colorHex2.slice(4, 6), 16);

    const gradient = `linear-gradient(to bottom, rgb(${red}, ${green}, ${blue}), rgb(${red2}, ${green2}, ${blue2}))`;
    return gradient;
  }

  if (selectedEvent && eventContract) {
    event = selectedEvent.split("/")[1];
    contract = eventContract.split("/")[1];
  }

  return (
    <div>
      <div>
        <div className="font-bold uppercase">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      {supporters.length === 0 && (
        <p className="mt-1 text-sm text-gray-600">No Data Available...</p>
      )}
      {event === contract ? (
        <div className="grid grid-cols-8 gap-2 py-4">
          {supporters
            .slice(0, 15)
            .map((supporter: Attendees, index: number) => (
              <AspectRatio ratio={1} key={index}>
                <Avatar className="h-full w-full bg-slate-800">
                  <AvatarFallback
                    style={{
                      background: generateColorFromAddress(String(supporter)),
                    }}
                  />
                </Avatar>
              </AspectRatio>
            ))}

          {supporters.length > 15 && (
            <AspectRatio ratio={1}>
              <Avatar className="h-full w-full">
                <AvatarFallback>+{supporters.length - 15}</AvatarFallback>
              </Avatar>
            </AspectRatio>
          )}
        </div>
      ) : (
        <div className="mt-2 w-full">
          No supporters yet. Mint to support above.
        </div>
      )}
    </div>
  );
};

export default SupportersList;
