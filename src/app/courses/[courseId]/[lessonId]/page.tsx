"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Play, Captions, Download, FileText, CheckCircle2, ChevronDown, ExternalLink, Paperclip, BookOpen, NotebookPen, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Framework-only lesson page using dummy data.
 * Drop this into a Next.js route like app/courses/[courseId]/[lessonId]/page.tsx and wire to real data later.
 */
export default function LessonPage() {
  // --- Dummy data until DB is wired ---
  const course = {
    id: "course-ux101",
    title: "Intro to Networks",
    unitTitle: "Unit 1: Fundamentals",
    progress: 45,
  };

  const lesson = {
    id: "lesson-10",
    number: 10,
    title: "IP Addressing & Subnetting",
    duration: "14:36",
    summary:
      "Learn how to calculate subnets, CIDR notation, and configure interfaces. We'll practice with a small 3-router lab.",
    attachments: [
      { id: "a1", name: "Slides - Subnetting 101.pdf", size: "2.3 MB" },
      { id: "a2", name: "Lab Topology.pkt", size: "140 KB" },
      { id: "a3", name: "Worksheet - CIDR Practice.pdf", size: "410 KB" },
    ],
    resources: [
      { id: "r1", label: "RFC 4632 - Classless Inter-Domain Routing (CIDR)", href: "#" },
      { id: "r2", label: "VLSM Calculator", href: "#" },
    ],
  };

  const unitLessons = [
    { id: "l1", title: "What is a Network?", duration: "08:24", status: "done" },
    { id: "l2", title: "OSI vs TCP/IP Models", duration: "12:10", status: "done" },
    { id: "l3", title: "Binary Basics", duration: "09:03", status: "done" },
    { id: "l4", title: "IP Addressing & Subnetting", duration: "14:36", status: "current" },
    { id: "l5", title: "Routing Primer", duration: "16:50", status: "locked" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page container without navbar/footer; those will be injected elsewhere */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-[1fr_320px] md:p-8">
        {/* LEFT: Main content */}
        <div className="space-y-6">
          {/* Lesson header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Lesson {lesson.number}: {lesson.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{course.title} • {course.unitTitle} • {lesson.duration}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Draft UI</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    Actions <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mark complete</DropdownMenuItem>
                  <DropdownMenuItem>Report issue</DropdownMenuItem>
                  <DropdownMenuItem>Bookmark</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Media / Viewer */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <div className="space-y-1">
                <CardTitle className="text-xl">Lesson Viewer</CardTitle>
                <CardDescription>{lesson.summary}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" className="gap-2"><Play className="h-4 w-4"/>Play</Button>
                <Button size="sm" variant="outline" className="gap-2"><ExternalLink className="h-4 w-4"/>Open in new tab</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Video/Player placeholder */}
                <AspectRatio ratio={16/9} className="w-full overflow-hidden rounded-xl bg-muted/60 ring-1 ring-border">
                    <div className="flex h-full w-full items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                                <Play className="h-6 w-6" />
                            </div>
                            <p className="text-sm text-muted-foreground">Video placeholder (wire to player later)</p>
                        </div>
                    </div>
                </AspectRatio>
            </CardContent>
          </Card>

          <Tabs defaultValue="transcript" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transcript" className="gap-2"><Captions className="h-4 w-4"/>Transcript</TabsTrigger>
              <TabsTrigger value="notes" className="gap-2"><NotebookPen className="h-4 w-4"/>Notes</TabsTrigger>
              <TabsTrigger value="resources" className="gap-2"><BookOpen className="h-4 w-4"/>Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="transcript" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lesson Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 text-sm leading-relaxed">
                        Welcome to this lesson on IP Addressing and Subnetting. In this video, we will explore the fundamentals of IP addressing, including how to calculate subnets and understand CIDR notation. By the end of this lesson, you'll be able to configure interfaces and practice subnetting with a small 3-router lab.
                    </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Attach notes</CardTitle>
                  <CardDescription>Your notes are private. Autosave coming later.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="Title (optional)" />
                  <Textarea placeholder="Type your lesson notes here..." className="min-h-[160px] resize-y" />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Clear</Button>
                    <Button>Save draft</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Extra resources</CardTitle>
                  <CardDescription>Helpful links and references for deeper learning.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lesson.resources.map((r) => (
                    <a key={r.id} href={r.href} className="flex items-center justify-between rounded-md border p-3 transition hover:bg-muted/70">
                      <span className="text-sm">{r.label}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Workspace mock (optional area from sketch) */}
          

          {/* Prev/Next navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="gap-2"><ChevronLeft className="h-4 w-4"/> Previous</Button>
            <Button className="gap-2">Next lesson <ChevronRight className="h-4 w-4"/></Button>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{course.unitTitle}</CardTitle>
                <Badge variant="secondary">{course.progress}%</Badge>
              </div>
              <CardDescription>Progress through the unit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={course.progress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Lessons</CardTitle>
              <CardDescription>Current lesson is highlighted.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[420px]">
                <ul className="divide-y">
                  {unitLessons.map((l) => (
                    <li key={l.id} className={`flex items-center justify-between px-4 py-3 ${l.status === "current" ? "bg-muted/60" : ""}`}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{l.title}</p>
                        <p className="text-xs text-muted-foreground">{l.duration}</p>
                      </div>
                      {l.status === "done" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                      {l.status === "current" && <Badge>Now</Badge>}
                      {l.status === "locked" && <Badge variant="secondary">Locked</Badge>}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          
        </aside>
      </div>
    </div>
  );
}
