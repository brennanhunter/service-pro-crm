// app/test-services/NewServiceButton.tsx
'use client'
import { useState } from 'react'

export default function NewServiceButton() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <button 
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + New Service
      </button>

      {showForm && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">New Service Request</h3>
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Service title..." 
              className="w-full p-2 border rounded"
            />
            <textarea 
              placeholder="Description..." 
              className="w-full p-2 border rounded h-20"
            />
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                Create
              </button>
              <button 
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}