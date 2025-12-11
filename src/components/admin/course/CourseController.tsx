'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { Unit, Lesson } from "@/db/schema";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LessonOverview from "./LessonOverview";
import { updateLessonUnitOrder } from "@/actions/admin/course";
import Link from "next/link";

interface CourseControllerProps {
  courseId: number;
  units: Unit[];
  lessons: Lesson[];
}

export default function CourseController({courseId, units, lessons }: CourseControllerProps) {
  const router = useRouter();
  // refs to store original data
  const originalUnitsRef = useRef<Unit[]>([]);
  const originalLessonsRef = useRef<Lesson[]>([]);
  // editable state
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [lessonList, setLessonList] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [changesMade, setChangesMade] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // controlled accordion state
  const [openUnits, setOpenUnits] = useState<string[]>([]);
  // initialize on props change
  useEffect(() => {
    const cloneUnits = structuredClone(units);
    const cloneLessons = structuredClone(lessons);
    originalUnitsRef.current = cloneUnits;
    originalLessonsRef.current = cloneLessons;
    setUnitList(cloneUnits);
    setLessonList(cloneLessons);
    setChangesMade(false);
    // default first unit open and first lesson selected
    if (cloneUnits.length > 0) {
      setOpenUnits([`unit-${cloneUnits[0].id}`]);
    }
    if (cloneLessons.length > 0) {
      setSelectedLesson(cloneLessons[0]);
    }
  }, [units, lessons]);

  const applyChanges = async (updatedUnits: Unit[], updatedLessons: Lesson[]) => {
    try {
      setIsSaving(true);
      // TODO: call your API
      const result = await updateLessonUnitOrder({ updatedUnits, updatedLessons });
      if (!result.data?.success) {
        console.error(result.data?.message);
        return;
      }
      router.refresh();
      setChangesMade(false);
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    setUnitList(structuredClone(originalUnitsRef.current));
    setLessonList(structuredClone(originalLessonsRef.current));
    setChangesMade(false);
  };

  const buildLessonsByUnit = (lessonsArr: Lesson[]) => {
    return lessonsArr.reduce((acc: Record<number, Lesson[]>, l) => {
      if (l.unitId == null) return acc;
      if (!acc[l.unitId]) acc[l.unitId] = [];
      acc[l.unitId].push({ ...l });
      return acc;
    }, {} as Record<number, Lesson[]>);
  };

  const flattenLessonsFromMap = (map: Record<number, Lesson[]>, unitsOrder: Unit[]) => {
    return unitsOrder.flatMap(u => {
      const arr = map[u.id] || [];
      return arr.map((lesson, idx) => ({ ...lesson, position: idx + 1 }));
    });
  };

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "UNIT") {
      const reordered = Array.from(unitList);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setUnitList(reordered.map((u, i) => ({ ...u, position: i + 1 })));
      setChangesMade(true);
      return;
    }

    if (type === "LESSON") {
      const lessonsMap = buildLessonsByUnit(lessonList);
      const sourceUnitId = Number(source.droppableId.replace("unit-", ""));
      const destUnitId = Number(destination.droppableId.replace("unit-", ""));
      lessonsMap[sourceUnitId] = lessonsMap[sourceUnitId] || [];
      lessonsMap[destUnitId] = lessonsMap[destUnitId] || [];
      const [movedLesson] = lessonsMap[sourceUnitId].splice(source.index, 1);
      if (!movedLesson) return;
      movedLesson.unitId = destUnitId;
      lessonsMap[destUnitId].splice(destination.index, 0, movedLesson);
      const newLessonList = flattenLessonsFromMap(lessonsMap, unitList);
      setLessonList(newLessonList);
      setChangesMade(true);
      return;
    }
  };

  const lessonsByUnit = buildLessonsByUnit(lessonList);

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex flex-col gap-4 md:w-1/4 order-2 md:order-1">
        <div className="h-[80vh] overflow-y-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Accordion type="multiple" value={openUnits} onValueChange={setOpenUnits}>
              <Droppable droppableId="units" type="UNIT">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                    {unitList.map((unit, index) => (
                      <Draggable key={unit.id} draggableId={`unit-${unit.id}`} index={index}>
                        {(unitProvided) => (
                          <div
                            ref={unitProvided.innerRef}
                            {...unitProvided.draggableProps}
                            className="border p-4 rounded bg-white shadow space-y-2"
                          >
                            <AccordionItem value={`unit-${unit.id}`}>
                              <div className="flex justify-between">
                                <span
                                  {...unitProvided.dragHandleProps}
                                  className="font-bold cursor-grab border-b pr-4 text-start"
                                >
                                  {`${unit.position}. ${unit.title}`}
                                </span>
                                <Link href={`/admin/courses/${courseId}/units/edit/${unit.id}`}>
                                  <button className="text-sm text-blue-600 cursor-pointer hover:underline">Edit Unit</button>
                                </Link>
                              </div>
                              <AccordionTrigger className="cursor-pointer">
                                View all Lessons
                              </AccordionTrigger>
                              <AccordionContent>
                                <Droppable droppableId={`unit-${unit.id}`} type="LESSON">
                                  {(lessonProvided) => (
                                    <div
                                      ref={lessonProvided.innerRef}
                                      {...lessonProvided.droppableProps}
                                      className="space-y-2 min-h-[40px] flex flex-col justify-start"
                                    >
                                      {(lessonsByUnit[unit.id] || []).map((lesson, lessonIndex) => (
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
                                              onClick={() => setSelectedLesson(lesson)}
                                              className={`p-2 border rounded cursor-pointer ${
                                                selectedLesson?.id === lesson.id
                                                  ? "bg-blue-200"
                                                  : "bg-gray-100"
                                              }`}
                                            >
                                              {lesson.position}. {lesson.title}
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
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

        {/* Action bar */}
        {changesMade && (
          <div className="sticky bottom-0 bg-white p-3 shadow flex gap-4 mt-2">
            <Button onClick={onCancel} disabled={isSaving} variant="outline">
              Cancel Changes
            </Button>
            <Button onClick={() => applyChanges(unitList, lessonList)} disabled={isSaving}>
              {isSaving ? "Saving..." : "Apply Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center md:w-3/4 order-1 md:order-2 border p-4">
        <LessonOverview courseId={courseId} lesson={selectedLesson} unit={units.find(u => u.id === selectedLesson?.unitId) || null} />
      </div>
    </div>
  );
}
