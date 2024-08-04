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
    restrictToHorizontalAxis,
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import Icon from '../Icon/Icon';

interface SortableImageProps {
    id: number;
    src: string;
    isActive: boolean;
    isDark: boolean;
    setCurrentIndex: () => void;
    onDeleteImg: (imgId: number) => void;
}

const SortableImage: React.FC<SortableImageProps> = ({
    id,
    src,
    isActive = false,
    isDark = false,
    setCurrentIndex,
    onDeleteImg
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
            className={`relative h-[50px] w-[50px] aspect-square flex items-center justify-center
                ${isActive ? activeStyle + " " + activeBorderStyle : ''}`}
            onClick={() => {
                setCurrentIndex();
            }}
            {...attributes} {...listeners}
        >
            <img src={src} alt={`img-${id}`} className='object-cover h-full w-auto rounded-md overflow-hidden' />
            <div className='absolute -top-1 -right-1 bg-red-500 rounded-full p-[1px]' onClick={(e) => {
                e.stopPropagation();
                onDeleteImg(id);
            }}>
                <Icon name='x' className='text-white' width={12} height={12} />
            </div>
        </Card>
    );
};

type SortableImageListProps = {
    imgList: ImgType[];
    setImgList: React.Dispatch<React.SetStateAction<ImgType[]>>;
    currentEditingIndex: number;
    setCurrentEditingIndex: React.Dispatch<React.SetStateAction<number>>;
    onDeleteImg: (imgId: number) => void;
};

const SortableImageList: React.FC<SortableImageListProps> = ({
    imgList,
    setImgList,
    currentEditingIndex,
    setCurrentEditingIndex,
    onDeleteImg
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
                modifiers={[restrictToHorizontalAxis]}
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
                                onDeleteImg={onDeleteImg}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default SortableImageList;
