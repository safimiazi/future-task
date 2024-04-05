
"use client"
import React, { useState, useEffect } from 'react';
import TreeItem from './child';


function Tree() {
  const [treeData, setTreeData] = useState([]);
  const storageKey = 'treeData';

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      setTreeData(JSON.parse(savedData));
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const addItemToTree = (tree, newItem, parentId) => {
    return tree.map((item) => {
      if (item.id === parentId) {
        return { ...item, children: [...(item.children || []), newItem] };
      } else if (item.children) {
        const updatedChildren = addItemToTree(item.children, newItem, parentId);
        return { ...item, children: updatedChildren };
      }
      return item;
    });
  };
  const handleAddNewItem = (parentId, ) => {
    const newItem = { id: Date.now(), name: 'New Item', children: [] };
  
    if (parentId === null) {
      const updatedData = [...treeData, newItem];
      setTreeData(updatedData);
      saveToLocalStorage(updatedData);
    } else {
      const updatedData = addItemToTree(treeData, newItem, parentId);
      setTreeData(updatedData);
      saveToLocalStorage(updatedData);
    }
  };

  
  const deleteItemFromTree = (tree, id) => {
    return tree.reduce((acc, item) => {
      if (item.id === id) {
        return acc;
      } else if (item.children) {
        return [...acc, { ...item, children: deleteItemFromTree(item.children, id) }];
      }
      return [...acc, item];
    }, []);
  };

  const handleDeleteItem = (id) => {
    const updatedData = deleteItemFromTree(treeData, id);
    setTreeData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const updateItemInTree = (tree, id, newName) => {
    return tree.map((item) => {
      if (item.id === id) {
        return { ...item, name: newName };
      } else if (item.children) {
        return { ...item, children: updateItemInTree(item.children, id, newName) };
      }
      return item;
    });
  };

  const handleUpdateItem = (id, newName) => {
    const updatedData = updateItemInTree(treeData, id, newName);
    setTreeData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleClear = () => {
    setTreeData([])
    localStorage.clear()
  }

  return (
    <div>
      <div className='flex flex-col items-center mb-1'>
      <button className='p-1 px-2 mt-2 rounded bg-red-400' onClick={handleClear}>Clear All</button>
      <button className='p-1 px-2 mt-2 rounded bg-green-400' onClick={() => handleAddNewItem(null, treeData)}>Add New Item</button>
      </div>
      <div className='flex justify-center gap-5'>
        {treeData.map((item) => (
          <TreeItem
            key={item.id}
            id={item.id}
            name={item.name}
            children={item.children || []}
            onDelete={handleDeleteItem}
            onUpdate={handleUpdateItem}
            onAdd={handleAddNewItem}
          />
        ))}
      </div>
    </div>
  );
}

export default Tree;