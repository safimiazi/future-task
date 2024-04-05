import { useState } from "react";

function TreeItem({ id, name, children = [], onDelete, onUpdate, onAdd }) {
  const [newName, setNewName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdate = () => {
    onUpdate(id, newName);
    setIsEditing(false);
  };



  return (
    <div>
      <div className='flex flex-col justify-center items-center'>
        <div>
          <div className='py-2 px-3 cursor-pointer rounded-2xl shadow-md border bg-green-700'>
            {isEditing ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            ) : (
              <span className='py-2 px-3 cursor-pointer rounded-2xl shadow-md border bg-green-700' onClick={()=> onAdd(id)}>{name}</span>
            )}
          </div>
          <div className='flex gap-2'>
            <button className='p-1 px-2 mt-2 rounded bg-gray-400'>{isEditing ? (
              <span onClick={handleCancel}>Cancel</span>
            ) : (
              <span onClick={handleEdit}>Edit</span>
            )}</button>
            <button className='p-1 px-2 mt-2 rounded bg-gray-400' onClick={() => onDelete(id)}>Delete</button>
            {isEditing && <button className='p-1 px-2 mt-2 rounded bg-gray-400' onClick={handleUpdate}>Update</button>}
          </div>
        </div>
      </div>
      <div className='flex'>
        {/* Render children recursively */}
        {children.map((child) => (
          <TreeItem
            key={child.id}
            id={child.id}
            name={child.name}
            children={child.children}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
}

export default TreeItem;