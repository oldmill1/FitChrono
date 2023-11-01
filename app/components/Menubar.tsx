import React from 'react';
export default function Menubar({
  title,
  listItems = [],
}: {
  title: string;
  listItems?: { name: string; httpEntity: React.ReactNode }[];
}) {
  return (
    <div className='menubar'>
      <h1>{title}</h1>
      {listItems.length > 0 && (
        <nav>
          <ul>
            {listItems.map((item, i) => (
              <li key={i}>
                {item.httpEntity}
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
