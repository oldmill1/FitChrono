import React from 'react';
import { NavLink } from '@remix-run/react';
export default function StrengthBar({
  title,
  listItems = [],
  returnTo = null,
}: {
  title: string;
  listItems?: {
    name: string;
    httpEntity: React.ReactNode;
    itemValue: string | number;
  }[];
  returnTo?: string | null;
}) {
  return (
    <div className='strengthBar'>
      <div className='strengthBar-title'>
        {returnTo && <NavLink to={returnTo}>&#8592; Back</NavLink>}
        <h1>{title}</h1>
      </div>
      {listItems.length > 0 && (
        <nav>
          <ul>
            {listItems.map((item, i) => (
              <li key={i}>
                <button>
                  <span>{item.httpEntity}</span>
                  {item.name}
                  &nbsp; {item.itemValue}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
