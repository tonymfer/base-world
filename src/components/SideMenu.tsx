import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetContent className="z-[2000]">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            {`Make changes to your profile here. Click save when you're done.`}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
    </Sheet>
  );
}
