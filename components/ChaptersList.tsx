"use client";
import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";

import { Chapters } from "@prisma/client";
import { Grip, ListIcon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

interface ChaptersListProps {
  onEdit: (id: string) => void;
  onReorder: (updateData: { position: number; id: string }[]) => void;
  chapters: Chapters[];
  reset: boolean;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChaptersList = ({
  onEdit,
  onReorder,
  chapters,
  reset,
  setReset,
}: ChaptersListProps) => {
  const [chaptersLocal, setChaptersLocal] = useState(chapters);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChaptersLocal(chapters);
  }, [chapters]);

  useEffect(() => {
    if (reset) {
      setChaptersLocal(chapters);
    }
    return () => {
      setReset(false);
    };
  }, [reset, chapters, setReset]);

  const reorder = (list: Chapters[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items: Chapters[] = reorder(
      chaptersLocal,
      result.source.index,
      result.destination.index
    );

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);
    const updatedChapters = items.slice(startIndex, endIndex + 1);
    setChaptersLocal(items);

    const bulkUpdate = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
      name: chapter.title,
    }));
    onReorder(bulkUpdate);
  };

  if (!isMounted) return null;
  return (
    <div className="space-y-2">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {chaptersLocal.map((chapter, index) => (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        " bg-slate-200 rounded-md text-slate-700 flex items-center mb-4",
                        chapter.isPublished && " bg-sky-200 text-sky-700"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center hover:bg-slate-300 px-2 py-3 rounded-l-md mr-2",
                          chapter.isPublished && "hover:bg-sky-300 "
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip
                          className={cn(
                            "h-4 w-4 text-slate-700 mr-2",
                            chapter.isPublished && "text-sky-700"
                          )}
                        />
                      </div>
                      {chapter.title}
                      <div className="ml-auto pr-2 gap-x-2 flex items-center">
                        {chapter.isFree && <Badge>Free</Badge>}
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            chapter.isPublished && "bg-sky-700"
                          )}
                        >
                          {chapter.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          className="w-4 h-4 hover:opacity-75 transition cursor-pointer"
                          onClick={() => {
                            onEdit(chapter.id);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ChaptersList;
