import React from 'react';
import { NavLink } from '@remix-run/react';
import classNames from 'classnames';

export default function StrengthBar({
  title,
  listItems = [],
  returnTo = undefined,
  message = undefined,
}: {
  title: string;
  listItems?: {
    name: string;
    httpEntity: React.ReactNode;
    itemValue: string | number;
  }[];
  returnTo?: string | null;
  message?: string | undefined;
}) {
  const messageClass = classNames('strengthBar-message', {
    'strengthBar-message-loaded': message !== undefined,
  });
  return (
    <div className='strengthBar'>
      <div className='strengthBar-title'>
        {returnTo && <NavLink to={returnTo}>&#8592; Back</NavLink>}
        <h1>{title}</h1>
        <div className={messageClass}>{message && <span>{message}</span>}</div>
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
