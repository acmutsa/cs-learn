"use client";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { tagSchema, type TagFormValues } from "@/lib/validations/course";
import { toast } from "sonner";
import { createTag } from "@/actions/admin";
import { TagModalProps } from "@/lib/types";

export default function TagModal({ onTagCreated }: TagModalProps) {
    const [tagName, setTagName] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = tagSchema.safeParse({ tagName });
        if (!result.success) {
            setError(result.error.issues[0].message)
            toast.error(result.error.issues[0].message)
        }
         else {
            const validatedData: TagFormValues = result.data;
            const response = await createTag(validatedData);
            if (!response.success) {
                setError(response.message);
                toast.error(response.message);
            } else {
                setError("");
                toast.success(response.message);
                setTagName("");
                onTagCreated?.();
                setOpen(false);
            }
        }
    }

    return (
        <div className="w-fit">
            <Dialog open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                    setTagName("");
                    setError("");
                }
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">Create a New Tag</Button> 
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Create Tag</DialogTitle>
                            <DialogDescription>
                            Make sure tag name is under 10 characters or less!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                            <Label htmlFor="tag">Tag Name</Label>
                            <Input id="tag" type="text" placeholder="Enter tag name" name="tag" value={tagName} onChange={(e) => setTagName(e.target.value)}/>
                            {error && <span style={{ color: "red"}}>{error}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                            <Button className="cursor-pointer" variant="outline" onClick={(e) => {setError(""); setTagName("");}}>Cancel</Button>
                            </DialogClose>
                            <Button className="cursor-pointer" type="submit">Create Tag</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}