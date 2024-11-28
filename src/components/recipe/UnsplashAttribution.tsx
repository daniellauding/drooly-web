interface UnsplashAttributionProps {
  photographer: {
    name: string;
    url: string;
  };
  photoUrl: string;
}

export function UnsplashAttribution({ photographer, photoUrl }: UnsplashAttributionProps) {
  return (
    <div className="text-xs text-gray-500">
      Photo by{' '}
      <a 
        href={photographer.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-gray-700"
      >
        {photographer.name}
      </a>
      {' '}on{' '}
      <a
        href={photoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-gray-700"
      >
        Unsplash
      </a>
    </div>
  );
}