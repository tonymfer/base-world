'use client';

import React, { useState } from 'react';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Icons } from '../icons';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommuContent from './communities-quest';
import EventContent from './event-quest';
import Image from 'next/image';

const achievements = [
  {
    title: 'First Achievement',
    description: 'This is your first achievement',
    image: 'path/to/image1.jpg',
    status: 'done',
  },
  {
    title: 'Second Achievement',
    description: 'This is your second achievement',
    image: 'path/to/image2.jpg',
    status: 'not done',
  },
  {
    title: 'First Achievement',
    description: 'This is your first achievement',
    image: 'path/to/image1.jpg',
    status: 'done',
  },
  {
    title: 'Second Achievement',
    description: 'This is your second achievement',
    image: 'path/to/image2.jpg',
    status: 'not done',
  },
  {
    title: 'First Achievement',
    description: 'This is your first achievement',
    image: 'path/to/image1.jpg',
    status: 'done',
  },
  {
    title: 'Second Achievement',
    description: 'This is your brian achievement',
    image: 'path/to/image2.jpg',
    status: 'not done',
  },
  {
    title: 'First Achievement',
    description: 'This is your first achievement',
    image: 'path/to/image1.jpg',
    status: 'done',
  },
  {
    title: 'Second Achievement',
    description: 'This is your second achievement',
    image: 'path/to/image2.jpg',
    status: 'not done',
  },
  {
    title: 'First Achievement',
    description: 'This is your first achievement',
    image: 'path/to/image1.jpg',
    status: 'done',
  },
  {
    title: 'Second Achievement',
    description: 'This is your second achievement',
    image: 'path/to/image2.jpg',
    status: 'not done',
  },
];

const ProfileContent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAchievements = achievements.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="container mx-auto grid h-[85vh] grid-cols-12 gap-4">
      <div className="col-span-4 flex flex-col gap-y-3">
        <div className="flex h-36 items-center justify-start border border-red-500 px-5">
          <div className="flex items-center gap-x-2">
            <img
              src="https://via.placeholder.com/92"
              alt="profile"
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">ayvee.eth</h1>
              <p className="text-sm">0x1232...1232</p>
              <div className="mt-1 flex flex-col gap-x-4 gap-y-1 text-xs md:flex-row md:items-center md:text-sm">
                <p>12 attended</p>
                <p>12 supported</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-y-2 border border-blue-500 px-5 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl">Achievements</h1>
            <p className="text-base text-muted-foreground">4/36</p>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Icons.filter />
          </div>
          <ScrollArea className="flex-1 py-1">
            <div className="flex h-[300px] flex-col gap-y-4">
              {filteredAchievements.map((achievement, index) => (
                <div className="flex h-[60px] gap-x-2 rounded-md" key={index}>
                  <img
                    src="https://via.placeholder.com/60"
                    alt="profile"
                    className="rounded-full"
                  />
                  <div className="flex flex-col flex-wrap">
                    <h2>{achievement.title}</h2>
                    <p className="text-xs">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="col-span-8 flex flex-col gap-4">
        <div className="border border-green-400">
          <Tabs defaultValue="communities" className="h-full">
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="communities">
                Communities
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="events">
                Events
              </TabsTrigger>
            </TabsList>
            <TabsContent value="communities">
              <CommuContent filteredAchievements={filteredAchievements} />
            </TabsContent>
            <TabsContent value="events">
              <EventContent filteredAchievements={filteredAchievements} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="relative h-auto w-full flex-1 bg-red-500">
          <Image
            src={'/images/map.png'}
            alt="map"
            objectFit="fill"
            objectPosition="center"
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
