'use client';

import React, { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import UpcomingQueue from './UpcomingQueue';
import CalendarHeader from './CalendarHeader';
import AddContentModal from './AddContentModal';
import { calendarPosts, CalendarPost } from './mockData';

export default function ContentCalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'linkedin', 'twitter']);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState<CalendarPost[]>(calendarPosts);

    const togglePlatform = (platform: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
        );
    };

    const handleDayClick = (date: Date) => {
        setSelectedDay(date);
        setShowModal(true);
    };

    const handleAddPost = (post: CalendarPost) => {
        setPosts((prev) => [...prev, post]);
    };

    return (
        <div className="space-y-6">
            <CalendarHeader
                currentDate={currentDate}
                viewMode={viewMode}
                selectedPlatforms={selectedPlatforms}
                onPrevMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                onNextMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                onViewModeChange={setViewMode}
                onTogglePlatform={togglePlatform}
                onAddContent={() => { setSelectedDay(new Date()); setShowModal(true); }}
            />

            <div className="flex gap-5 items-start">
                {/* Calendar Grid */}
                <div className="flex-1 min-w-0">
                    <CalendarGrid
                        currentDate={currentDate}
                        posts={posts.filter((p) => selectedPlatforms.includes(p.platform))}
                        onDayClick={handleDayClick}
                    />
                </div>

                {/* Upcoming Queue Sidebar */}
                <div className="w-72 flex-shrink-0">
                    <UpcomingQueue
                        posts={posts.filter((p) => selectedPlatforms.includes(p.platform))}
                    />
                </div>
            </div>

            {showModal && selectedDay && (
                <AddContentModal
                    date={selectedDay}
                    existingPosts={posts.filter((p) => {
                        const d = new Date(p.scheduledDate);
                        return (
                            d.getFullYear() === selectedDay.getFullYear() &&
                            d.getMonth() === selectedDay.getMonth() &&
                            d.getDate() === selectedDay.getDate()
                        );
                    })}
                    onClose={() => setShowModal(false)}
                    onAdd={handleAddPost}
                />
            )}
        </div>
    );
}