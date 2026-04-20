import { FaWifi } from "react-icons/fa6";
import { PiCat } from "react-icons/pi";
import { BsForkKnife } from "react-icons/bs";
import { IoCarOutline } from "react-icons/io5";
import type { AmenitiesProps } from "../../types/venue.types";

export function Amenities({ meta }: AmenitiesProps) {
  const amenities = [
    { key: "wifi", label: "WiFi", icon: FaWifi, enabled: meta?.wifi },
    { key: "pets", label: "Pets allowed", icon: PiCat, enabled: meta?.pets },
    {
      key: "parking",
      label: "Parking",
      icon: IoCarOutline,
      enabled: meta?.parking,
    },
    {
      key: "breakfast",
      label: "Breakfast included",
      icon: BsForkKnife,
      enabled: meta?.breakfast,
    },
  ];

  const visibleAmenities = amenities.filter((item) => item.enabled);

  if (visibleAmenities.length === 0) {
    return <p className="text-lg font-bold">No amenities included</p>;
  }

  return (
    <div style={{ backgroundColor: "#957161" }}>
      <div className="mt-3 flex flex-wrap justify-center gap-3 p-2">
        {visibleAmenities.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="flex h-32 w-40 flex-col items-center justify-center gap-2 p-3 text-center"
            >
              <Icon className="text-white text-2xl" />
              <p className="flex min-h-[2.5rem] w-full items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap text-black text-sm leading-tight">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
