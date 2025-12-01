// src/app/profile/ProfileForm.tsx

"use client";

import { useTransition, FormEvent } from "react";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfile } from "@/actions/update-profile";

type ProfileFormProps = {
  name: string;
  email: string;
  image: string | null;
  initials: string;
};

export function ProfileForm({ name, email, image, initials }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateProfile(formData);
        toast.success("Profile updated", {
          description: "Your changes have been saved.",
        });
      } catch (err) {
        console.error(err);
        toast.error("Update failed", {
          description: "Something went wrong while saving your profile.",
        });
      }
    });
  };

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {image ? (
              <AvatarImage src={image} alt={name || email} />
            ) : (
              <>
                <AvatarImage src="/user.png" alt="User avatar" />
                <AvatarFallback>{initials}</AvatarFallback>
              </>
            )}
          </Avatar>

          <div className="space-y-1">
            <CardTitle className="text-xl">Your Profile</CardTitle>
            <CardDescription>
              View and update your account information.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Name (editable) */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={name}
              placeholder="Your name"
              required
              disabled={isPending}
            />
          </div>

          {/* Email (read-only) */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Email is managed by authentication and cannot be changed here.
            </p>
          </div>

          {/* Avatar URL (editable) */}
          <div className="grid gap-2">
            <Label htmlFor="image">Avatar URL</Label>
            <Input
              id="image"
              name="image"
              defaultValue={image ?? ""}
              placeholder="https://example.com/avatar.png"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Paste a direct image URL. Later you can replace this with an
              upload flow using your S3/blob system.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-4 gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
