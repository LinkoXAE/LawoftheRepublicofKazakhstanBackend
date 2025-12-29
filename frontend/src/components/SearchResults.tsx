import React from 'react';

interface Props {
  results: any[];
  onOpen: (url: string) => void;
}

export const SearchResults: React.FC<Props> = ({ results, onOpen }) => {
  return (
    <ul>
      {results.map((item, i) => (
        <li key={i}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpen(item.url);
            }}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
};
