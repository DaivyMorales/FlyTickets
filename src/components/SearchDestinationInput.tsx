import { useState, useEffect, useRef } from "react";
import { PiAirplaneLandingFill } from "react-icons/pi";

type City = {
  city: string;
  country: string;
  countryCode: string;
};

interface Props {
  onSelect: (value: string) => void;
  initialValue?: string;
}

export default function SearchDestinationInput({ onSelect, initialValue }: Props) {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchCities = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searchQuery}&limit=5&languageCode=es`,
        {
          headers: {
            "X-RapidAPI-Key": "9810e3a8cdmsh69731c78e1ce926p1c86a7jsn46c865c06eaf",
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        const countries = new Intl.DisplayNames(["es"], { type: "region" });
        setResults(
          data.data.map((item: any) => ({
            city: item.city,
            country: countries.of(item.countryCode) || item.country,
            countryCode: item.countryCode,
          }))
        );
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error al buscar ciudades:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchCities(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative w-full">
      <label className="text-neutral-300 mb-2 block text-xs font-medium">
        ¿A dónde quieres viajar?
      </label>
      <label className="input flex w-full items-center gap-2 rounded-md bg-zinc-900">
        <PiAirplaneLandingFill className="text-zinc-400" />
        <input
          ref={inputRef}
          className="w-full bg-transparent text-xs outline-none"
          placeholder="Ej: Tokyo, Japón"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </label>

      {isOpen && (query.length > 1 || loading) && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-b-md border-[1px] border-zinc-700 bg-zinc-800 shadow-lg">
          {loading && (
            <div className="px-4 py-2 text-xs font-bold text-white">
              Cargando...
            </div>
          )}
          {!loading &&
            results.map((city, index) => (
              <div
                key={index}
                className="cursor-pointer px-4 py-2 text-xs hover:bg-zinc-700"
                onClick={() => {
                  const cityString = `${city.city}, ${city.country}`;
                  setQuery(cityString);
                  onSelect(cityString);
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
