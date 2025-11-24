'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import type { Unit, Lesson } from "@/db/schema";
import LessonOverview from "./LessonOverview";
import { useState } from "react";

interface CourseControllerProps {
  units: Unit[];
  lessons: Lesson[];
}

export default function CourseController({ units, lessons }: CourseControllerProps) {

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "UNIT") {
      console.log("Reorder units:", { source, destination });
      return;
    }

    if (type === "LESSON") {
      console.log("Move lesson:", { source, destination });
      return;
    }
  };

  const lessonsByUnit = lessons.reduce(
    (acc, lesson) => {
      // Ensure the key exists, initialize if not
      const unitId = lesson.unitId;
      if (unitId === null || unitId === undefined) {
        // Handle lessons without a unitId if necessary (e.g., skip or group under a special key)
        return acc;
      }
      
      // Add the lesson to the correct unit's array
      acc[unitId] = acc[unitId] || [];
      acc[unitId].push(lesson);
      
      return acc;
    },
    // Initialize the accumulator as an empty object of the correct structure
    {} as Record<number, Lesson[]> // Type assertion for TypeScript safety
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/4 order-2 md:order-1">
        <DragDropContext onDragEnd={onDragEnd}>
          <Accordion type="single" collapsible>
            <Droppable droppableId="units" type="UNIT">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {units.map((unit, index) => (
                      <Draggable
                        key={unit.id}
                        draggableId={`unit-${unit.id}`}
                        index={index}
                      >
                        {(unitProvided) => (
                          <div
                            ref={unitProvided.innerRef}
                            {...unitProvided.draggableProps}
                            className="border p-4 rounded bg-white shadow space-y-2"
                          >
                            <AccordionItem value="index">
                            {/* UNIT HEADER – drag handle ONLY */}
                            <div
                              {...unitProvided.dragHandleProps}
                              className="font-bold cursor-grab border-b"
                            >
                              {unit.position}. {unit.title}
                            </div>
                            <AccordionTrigger className="cursor-pointer">View all Lessons</AccordionTrigger>
                            {/* NESTED LESSON LIST */}
                            <AccordionContent >
                              <Droppable
                                droppableId={`unit-${unit.id}`}
                                type="LESSON"
                              >
                                {(lessonProvided) => (
                                  <div
                                    ref={lessonProvided.innerRef}
                                    {...lessonProvided.droppableProps}
                                    className="pl-4 space-y-2"
                                  >
                                    {(lessonsByUnit[unit.id] || []).map(
                                      (lesson, lessonIndex) => (
                                        <Draggable
                                          key={lesson.id}
                                          draggableId={`lesson-${lesson.id}`}
                                          index={lessonIndex}
                                        >
                                          {(lessonDraggable) => (
                                            <div
                                              ref={lessonDraggable.innerRef}
                                              {...lessonDraggable.draggableProps}
                                              {...lessonDraggable.dragHandleProps}
                                              className="p-2 border rounded bg-gray-100"
                                            >
                                              {lesson.position}. {lesson.title}
                                            </div>
                                          )}
                                        </Draggable>
                                      )
                                    )}
                                    {lessonProvided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </AccordionContent>
                            </AccordionItem>
                          </div>
                        )}
                      </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Accordion>
        </DragDropContext>
        </div>
      <div className="flex justify-center md:w-3/4 order-1 md:order-2 border" >
        <LessonOverview />
      </div>
    </div>
  );
}