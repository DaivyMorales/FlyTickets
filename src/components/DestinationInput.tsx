import { useState, useEffect, useRef } from 'react';
import { PiAirplaneLandingFill } from 'react-icons/pi';

type City = {
  city: string;
  country: string;
  countryCode: string;
};

export default function DestinationInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCities = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&languageCode=es`,
          {
            headers: {
              'X-RapidAPI-Key': '9810e3a8cdmsh69731c78e1ce926p1c86a7jsn46c865c06eaf',
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
          }
        );
        const data = await response.json();
        // Validate that data and data.data exist and is an array
        if (data && Array.isArray(data.data)) {
          const countries = new Intl.DisplayNames(['es'], { type: 'region' });
          setResults(data.data.map((item: any) => ({
            city: item.city,
            country: countries.of(item.countryCode) || item.country,
            countryCode: item.countryCode
          })));
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error al buscar ciudades:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative w-full">
      <label className="input w-full bg-zinc-900 relative rounded-r-md">
        <PiAirplaneLandingFill />
        <input
          ref={inputRef}
          className="input-sm w-full"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Destino"
          required
        />
      </label>

      {isOpen && (query.length > 1 || loading) && (
        <div className="absolute mt-1 w-full rounded-md bg-zinc-800 shadow-lg max-h-60 overflow-auto z-10">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-400">Cargando...</div>
          )}
          {!loading &&
            results.map((city, index) => (
              <div
                key={index}
                className="px-4 py-2 text-xs hover:bg-zinc-700 cursor-pointer"
                onClick={() => {
                  setQuery(`${city.city}, ${city.country}`);
                  setIsOpen(false);
                }}
              >
                {city.city}, {city.country}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
