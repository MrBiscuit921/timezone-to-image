"use client";

import {useState, useEffect} from "react";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

const timezoneOptions: Option[] = [
  {label: "International Date Line West (GMT-12)", value: "Etc/GMT-12"},
  {label: "Nome, USA (GMT-11)", value: "America/Nome"},
  {label: "Hawaii, USA (GMT-10)", value: "Pacific/Honolulu"},
  {label: "Anchorage, USA (GMT-9)", value: "America/Anchorage"},
  {label: "Los Angeles, USA (GMT-8)", value: "America/Los_Angeles"},
  {label: "Phoenix, USA (GMT-7)", value: "America/Phoenix"},
  {label: "Mexico City, Mexico (GMT-6)", value: "America/Mexico_City"},
  {label: "New York, USA (GMT-5)", value: "America/New_York"},
  {label: "Caracas, Venezuela (GMT-4)", value: "America/Caracas"},
  {
    label: "Buenos Aires, Argentina (GMT-3)",
    value: "America/Argentina/Buenos_Aires",
  },
  {label: "Azores, Portugal (GMT-2)", value: "Atlantic/Azores"},
  {label: "London, UK (GMT+0)", value: "Europe/London"},
  {label: "Paris, France (GMT+1)", value: "Europe/Paris"},
  {label: "Cairo, Egypt (GMT+2)", value: "Africa/Cairo"},
  {label: "Moscow, Russia (GMT+3)", value: "Europe/Moscow"},
  {label: "Dubai, UAE (GMT+4)", value: "Asia/Dubai"},
  {label: "Karachi, Pakistan (GMT+5)", value: "Asia/Karachi"},
  {label: "Delhi, India (GMT+5:30)", value: "Asia/Kolkata"},
  {label: "Dhaka, Bangladesh (GMT+6)", value: "Asia/Dhaka"},
  {label: "Bangkok, Thailand (GMT+7)", value: "Asia/Bangkok"},
  {label: "Singapore (GMT+8)", value: "Asia/Singapore"},
  {label: "Seoul, South Korea (GMT+9)", value: "Asia/Seoul"},
  {label: "Sydney, Australia (GMT+10)", value: "Australia/Sydney"},
  {label: "Auckland, New Zealand (GMT+12)", value: "Pacific/Auckland"},
];

export default function Home() {
  const [selectedTimezone, setSelectedTimezone] = useState<Option | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure this runs only on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (selectedTimezone) {
      const intervalId = setInterval(() => {
        const time = new Date().toLocaleString("en-US", {
          timeZone: selectedTimezone.value,
        });
        setCurrentTime(time);
      }, 60000); // update every minute

      return () => clearInterval(intervalId); // cleanup on unmount
    }
  }, [selectedTimezone]);

  const handleGenerateImage = () => {
    if (selectedTimezone) {
      setIsLoading(true);
      const newImageUrl = `/api/generate-image?timezone=${selectedTimezone.value}`;
      setImageUrl(newImageUrl);
      setIsLoading(false); // Set it to false after generation
    }
  };

  // Don't render the component that depends on client-side JavaScript until after mounting
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl mb-8">Timezone Image Generator</h1>

      {/* Dropdown */}
      <Select
        options={timezoneOptions}
        value={selectedTimezone}
        onChange={setSelectedTimezone}
        getOptionLabel={(e) => e.label}
        getOptionValue={(e) => e.value}
        placeholder="Select a timezone"
        aria-label="Timezone selector"
        className="mb-4 w-full max-w-lg"
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: "#2d3748",
            borderColor: "#4a5568",
            color: "#fff",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "#fff",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "#2b6cb0"
              : state.isFocused
              ? "#4a5568"
              : "#2d3748",
            color: "#fff",
            padding: "10px",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: "#fff",
          }),
          clearIndicator: (provided) => ({
            ...provided,
            color: "#fff",
          }),
        }}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerateImage}
        disabled={isLoading}
        aria-label="Generate image for the selected timezone"
        className="p-2 bg-blue-600 text-white rounded mb-4"> 
        {isLoading ? "Generating Image..." : "Generate Image"}
      </button>

      {/* Image and Markdown */}
      {imageUrl && (
        <div className="mt-8 w-full max-w-lg text-center">
          <h2 className="text-xl mb-4">Generated Image</h2>
          <img
            src={imageUrl}
            alt={`Current time in ${selectedTimezone?.value}`}
            className="w-full h-auto border border-gray-600 rounded-lg"
          />
          <p className="mt-4 text-sm text-gray-400">
            Embed the image using this markdown:
          </p>
          <pre className="bg-gray-800 p-2 text-sm text-white rounded">
            {`![](https://timezone-to-image.vercel.app/${imageUrl})`}
          </pre>
        </div>
      )}

      {/* Show current time only after client renders */}
      {currentTime && (
        <div className="mt-4 text-xl">Current time: {currentTime}</div>
      )}
    </div>
  );
}
