import React, { useState, useEffect } from 'react';

interface ChildItemProps {
  name: string;
  child: dataType;

}
interface dataType {
  key: string,
  value: string,
}

const ChildItem = ({ name, child }: ChildItemProps) => {
  const [children, setChildren] = useState<dataType[]>([]);
 
  useEffect(() => {
    const storedChildren = localStorage.getItem(name);
    if (storedChildren) {
      setChildren(JSON.parse(storedChildren));
    }
  }, [name]);

  const handleAddChild = () => {

    const newName = {
      key: name,
      value: `${name}.${children.length + 1}`

    }

    console.log(newName);
    setChildren([...children, newName]);
    localStorage.setItem(name, JSON.stringify([...children, newName]));
  };



  const handleDeleteChild = (child: dataType) => {
    localStorage.removeItem(child.value);
    const dataLocalStorage = localStorage.getItem(child.key);
    if (dataLocalStorage) {
      const parseValue: dataType[] = JSON.parse(dataLocalStorage);
      const deletedData = parseValue.filter((item) => item.value !== child.value);


      localStorage.setItem(child.key, JSON.stringify([...deletedData]))

      console.log(deletedData);
      window.location.reload()

    }

  };

  const handleUpdate = () => {
    const newText = prompt("Enter new text for the item:", name);

    if (newText !== null) {
        const keys = Object.keys(localStorage);
        
        let data: any[] = []; // Explicitly define the type of 'data'

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            if (key === child.value) {
                const value = localStorage.getItem(key);
                if (name !== null && value !== null) {

                    // Parse the JSON string to an array
                    const parsedValue = JSON.parse(value);
                    
                    // Loop through the parsed value and update keys
                    parsedValue.forEach((entry: any, index: number) => {
                        const newKey = `${name}.${index}`;
                        entry.key = newKey;
                    });

                    localStorage.setItem(name, JSON.stringify(parsedValue));
                } else {
                    console.log(`No data found in local storage for the key '${name}'`);
                }
            }
        }

        const updatedChildren = children.map(child => {
            if (child.value === name) {
                return { ...child, value: newText };
            }
            return child;
        });
        setChildren(updatedChildren);
        localStorage.setItem(name, JSON.stringify(updatedChildren));

        const dataLocalStorage = localStorage.getItem(child.key);
        if (dataLocalStorage) {
            const parseValue: dataType[] = JSON.parse(dataLocalStorage);
            const updatedData = parseValue.map(item => {
                if (item.value === name) {
                    return { ...item, value: newText };
                }
                return item;
            });

            localStorage.setItem(child.key, JSON.stringify(updatedData));



        }
    }
};





  return (
    <div className='flex flex-col items-center'>
      <div className='py-2 px-3 rounded-2xl shadow-md border text-white bg-green-700'>{name}</div>
      <div className='flex gap-2'>
        <button className='p-1 px-2 mt-2 rounded bg-gray-400' onClick={handleUpdate}>up</button>
        <button className='w-10 p-1 mt-2 rounded bg-gray-400' onClick={handleAddChild}>+</button>
        <button className='w-10 p-1 mt-2 mr-4 rounded bg-red-400 ml-2' onClick={() => handleDeleteChild(child)}>-</button>
      </div>
      <div className='flex'>
        {children.map((child, index) => (
          <ChildItem name={child.value} child={child} key={index} />
        ))}
      </div>
    </div>
  );
};

export default ChildItem;
