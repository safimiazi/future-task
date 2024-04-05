
"use client"
import React, { useState, useEffect } from 'react';
import TreeItem from './child';

interface Item {
  id: number;
  name: string;
  children?: Item[];
}

function Tree(): JSX.Element {
  const [treeData, setTreeData] = useState<Item[]>([]);
  const storageKey: string = 'treeData';

  useEffect(() => {
    const savedData: string | null = localStorage.getItem(storageKey);
    if (savedData) {
      setTreeData(JSON.parse(savedData));
    }
  }, []);

  const saveToLocalStorage = (data: Item[]): void => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const addItemToTree = (tree: Item[], newItem: Item, parentId: number | null): Item[] => {
    return tree.map((item: Item) => {
      if (item.id === parentId) {
        return { ...item, children: [...(item.children || []), newItem] };
      } else if (item.children) {
        const updatedChildren: Item[] = addItemToTree(item.children, newItem, parentId);
        return { ...item, children: updatedChildren };
      }
      return item;
    });
  };

  const handleAddNewItem = (parentId: number | null): void => {
    const newItem: Item = { id: Date.now(), name: 'New Item', children: [] };
    if (parentId === null) {
      const updatedData: Item[] = [...treeData, newItem];
      setTreeData(updatedData);
      saveToLocalStorage(updatedData);
    } else {
      const updatedData: Item[] = addItemToTree(treeData, newItem, parentId);
      setTreeData(updatedData);
      saveToLocalStorage(updatedData);
    }
  };

  const deleteItemFromTree = (tree: Item[], id: number): Item[] => {
    return tree.reduce((acc: Item[], item: Item) => {
      if (item.id === id) {
        return acc;
      } else if (item.children) {
        return [...acc, { ...item, children: deleteItemFromTree(item.children, id) }];
      }
      return [...acc, item];
    }, []);
  };

  const handleDeleteItem = (id: number): void => {
    const updatedData: Item[] = deleteItemFromTree(treeData, id);
    setTreeData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const updateItemInTree = (tree: Item[], id: number, newName: string): Item[] => {
    return tree.map((item: Item) => {
      if (item.id === id) {
        return { ...item, name: newName };
      } else if (item.children) {
        return { ...item, children: updateItemInTree(item.children, id, newName) };
      }
      return item;
    });
  };

  const handleUpdateItem = (id: number, newName: string): void => {
    const updatedData: Item[] = updateItemInTree(treeData, id, newName);
    setTreeData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleClear = (): void => {
    setTreeData([]);
    localStorage.clear();
  };

  return (
    <div>
      <div className='flex flex-col items-center mb-1'>
        <button className='p-1 px-2 mt-2 rounded bg-red-400' onClick={handleClear}>Clear All</button>
        <button className='p-1 px-2 mt-2 rounded bg-green-400' onClick={() => handleAddNewItem(null)}>Add New Item</button>
      </div>
      <div className='flex justify-center gap-5'>
        {treeData.map((item: Item) => (
          <TreeItem
            key={item.id}
            id={item.id}
            name={item.name}
            // eslint-disable-next-line react/no-children-prop
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
