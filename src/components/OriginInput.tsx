import { useState, useEffect, useRef } from "react";
import { PiAirplaneTakeoffFill } from "react-icons/pi";

type City = {
  city: string;
  country: string;
  countryCode: string;
};

export default function OriginInput({ setFormik }: { setFormik: any }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
            "X-RapidAPI-Key":
              "9810e3a8cdmsh69731c78e1ce926p1c86a7jsn46c865c06eaf",
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        },
      );
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        const countries = new Intl.DisplayNames(["es"], { type: "region" });
        setResults(
          data.data.map((item: any) => ({
            city: item.city,
            country: countries.of(item.countryCode) || item.country,
            countryCode: item.countryCode,
          })),
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
      void fetchCities();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <div className="relative w-full">
      <label
        className="text-neutral-300 mb-2 block text-xs font-medium"
        htmlFor="password"
      >
        Origen
      </label>
      <label className="input relative w-full rounded-l-md bg-zinc-900">
        <PiAirplaneTakeoffFill />
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
          placeholder="Chicago, USA"
          required
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
                  setFormik("origin", cityString); 
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
