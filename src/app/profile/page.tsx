import React from 'react';
import GlobeHeader from '@/components/Hero/GlobeHeader';
import ProfileContent from '@/components/Profile/profile-content';

const Profile = () => {
  return (
    <div>
      <GlobeHeader />
      <div className="pt-24">
        <ProfileContent />
      </div>
    </div>
  );
};

export default Profile;
