// src/components/SortableImageList.tsx
import React, { useEffect, useState } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImgType } from './ImageCrop';
import { Card } from '../ui/card';
import { useTheme } from '@/utils/ThemeProvider';
import {
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from '@dnd-kit/modifiers';

interface SortableImageProps {
    id: number;
    src: string;
    isActive: boolean;
    isDark: boolean;
    setCurrentIndex: () => void;
}

const SortableImage: React.FC<SortableImageProps> = ({
    id,
    src,
    isActive = false,
    isDark = false,
    setCurrentIndex
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const activeStyle = "scale-110";
    const activeBorderStyle = isDark ? 'border-2 border-white' : 'border-2 border-black';

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`h-[50px] w-[50px] aspect-square overflow-hidden flex items-center justify-center
                ${isActive ? activeStyle + " " + activeBorderStyle : ''}`}
            onClick={() => {
                setCurrentIndex();
            }}
            {...attributes} {...listeners}
        >
            <img src={src} alt={`img-${id}`} className='object-cover h-full w-auto' />
        </Card>
    );
};

type SortableImageListProps = {
    imgList: ImgType[];
    setImgList: React.Dispatch<React.SetStateAction<ImgType[]>>;
    currentEditingIndex: number;
    setCurrentEditingIndex: React.Dispatch<React.SetStateAction<number>>;
};

const SortableImageList: React.FC<SortableImageListProps> = ({
    imgList,
    setImgList,
    currentEditingIndex,
    setCurrentEditingIndex,
}) => {

    const { theme } = useTheme();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setImgList((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={imgList.map(item => item.id)}

                    strategy={rectSortingStrategy}
                >
                    <div className='flex flex-row gap-4'>
                        {imgList.map((img, index) => (
                            <SortableImage
                                key={img.id}
                                id={img.id}
                                src={img.src}
                                isDark={theme === 'dark'}
                                isActive={currentEditingIndex === index}
                                setCurrentIndex={() => setCurrentEditingIndex(index)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default SortableImageList;
