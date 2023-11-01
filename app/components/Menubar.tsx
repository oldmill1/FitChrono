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
                <button>
                  <span>{item.httpEntity}</span>
                  {item.name}
                  &nbsp; 0
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
