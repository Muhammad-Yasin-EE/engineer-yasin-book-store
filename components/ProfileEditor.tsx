'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera, Save, X, Edit, MapPin, Phone, Calendar, Book, Clock } from 'lucide-react'

export default function ProfileEditor({ profile, userEmail }: { profile: any, userEmail: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    school_university: profile?.school_university || '',
    age: profile?.age || '',
    birthday: profile?.birthday || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    city: profile?.city || ''
  })

  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [uploadingImage, setUploadingImage] = useState(false)

  const supabase = createClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true)
      setErrorMsg('')
      setSuccessMsg('')
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setAvatarUrl(data.publicUrl)
      
      // Auto save avatar to profile
      await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', profile.id)

      setSuccessMsg('Profile picture updated successfully!')
    } catch (error: any) {
      setErrorMsg(error.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          school_university: formData.school_university,
          age: formData.age ? parseInt(formData.age.toString()) : null,
          birthday: formData.birthday || null,
          phone: formData.phone,
          bio: formData.bio,
          city: formData.city
        })
        .eq('id', profile.id)

      if (error) throw error
      setSuccessMsg('Profile saved successfully!')
      setIsEditing(false)
      window.location.reload() // Refresh to update server-side fetched data
    } catch (error: any) {
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Profile Display Section */}
      <div className="bg-white border border-gray-200 rounded-none p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative shadow-sm hover:shadow-md transition-shadow">
        
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 text-xs font-bold text-gray-500 hover:text-[#B8212E] flex items-center gap-1.5 transition-colors"
        >
          <Edit className="w-4 h-4" /> Edit Profile
        </button>

        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="w-28 h-28 rounded-full border-4 border-gray-50 bg-gray-100 overflow-hidden relative group shadow-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#B8212E] to-red-900 text-white font-black text-4xl uppercase">
                {formData.name ? formData.name.charAt(0) : userEmail.charAt(0)}
              </div>
            )}
            
            {/* Quick Upload Overlay */}
            <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{uploadingImage ? 'Uploading...' : 'Change'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
          
          {uploadingImage && <div className="text-[10px] font-bold text-[#B8212E] animate-pulse">Uploading...</div>}
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{formData.name || 'Anonymous User'}</h2>
            <p className="text-xs font-bold text-gray-400">{userEmail}</p>
          </div>

          {formData.bio && (
            <p className="text-sm text-gray-600 font-medium leading-relaxed border-l-2 border-[#B8212E] pl-3 py-1 bg-gray-50">
              "{formData.bio}"
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-2">
            {formData.school_university && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Book className="w-4 h-4 text-gray-400" /> 
                <span className="truncate">{formData.school_university}</span>
              </div>
            )}
            {formData.city && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" /> {formData.city}
              </div>
            )}
            {formData.birthday && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" /> Born {formData.birthday}
              </div>
            )}
            {formData.age && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" /> {formData.age} Years Old
              </div>
            )}
            {formData.phone && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" /> {formData.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-none shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Edit Your Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-[#B8212E] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              {errorMsg && <div className="p-3 bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">{errorMsg}</div>}
              {successMsg && <div className="p-3 bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">{successMsg}</div>}

              <form id="profileForm" onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#B8212E]" placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">School / University</label>
                    <input type="text" name="school_university" value={formData.school_university} onChange={handleInputChange} className="w-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#B8212E]" placeholder="e.g. UET Lahore" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#B8212E]" placeholder="e.g. 21" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Birthday</label>
                    <input type="date" name="birthday" value={formData.birthday} onChange={handleInputChange} className="w-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#B8212E]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#B8212E]" placeholder="e.g. +92 300 1234567" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">City / Country</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#B8212E]" placeholder="e.g. Karachi, Pakistan" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Short Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className="w-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#B8212E] resize-none" placeholder="Write a short description about your career goals..."></textarea>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-full text-xs shadow-sm hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button form="profileForm" type="submit" disabled={loading} className="px-6 py-2.5 bg-[#B8212E] hover:bg-[#D62636] text-white font-bold rounded-full text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
