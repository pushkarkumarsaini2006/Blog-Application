import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({image, setImage, preview, setPreview}) => {
    const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update the image state
      setImage(file);

      // Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      if(setPreview){
        setPreview(preview)
      }
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if(setPreview){
      setPreview(null)
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  return (
    <div className="flex justify-center mb-6">
      <label htmlFor="profile-photo-input" className="sr-only">Profile photo</label>
      <input
        id="profile-photo-input"
        name="profilePhoto"
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-sky-50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-sky-500" />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-sky-500 to-cyan-400 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={onChooseFile}
            aria-label="Upload profile photo"
            title="Upload profile photo"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || previewUrl}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleRemoveImage}
            aria-label="Remove profile photo"
            title="Remove profile photo"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector