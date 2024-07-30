import React from 'react'
import { ScrollArea } from '../ui/scroll-area'

const EventContent = ({ filteredAchievements }) => {
  return (
    <ScrollArea className='flex-1 py-1 px-4'>
        <div className='flex flex-col gap-y-4 h-[300px]'>
        {filteredAchievements.map((achievement, index) => (
            <div className='flex h-[60px] gap-x-2 rounded-md' key={index}>
                <img src='https://via.placeholder.com/60' alt='profile' className='rounded-full' />
                <div className='flex flex-col flex-wrap'>
                    <h2>{achievement.title}</h2>
                    <p className='text-xs'>{achievement.description}</p>
                </div>
            </div>
        ))}
        </div>
    </ScrollArea>
  )
}

export default EventContent