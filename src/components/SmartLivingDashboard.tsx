import React, { useState, useEffect, useRef } from "react";

interface SmartObject {
  id: string;
  name: string;
  isOn: boolean;
}

const SmartLivingDashboard: React.FC = () => {
  const [objects, setObjects] = useState<SmartObject[]>([
    { id: "led1", name: "LED 1", isOn: false },
    { id: "led2", name: "LED 2", isOn: false },
  ]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://smartliving-temp.ddns.net/ws");

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const toggleObject = (id: string) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === id ? { ...obj, isOn: !obj.isOn } : obj
      )
    );

    const toggled = objects.find((o) => o.id === id);
    const newState = toggled ? !toggled.isOn : false;

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ device: id, state: newState }));
    } else {
      console.warn("WebSocket not connected");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          SmartLiving Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {objects.map((obj) => (
            <div
              key={obj.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ease-in-out
              ${obj.isOn ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
            >
              <span className="text-lg font-medium text-gray-700">{obj.name}</span>

              <label htmlFor={`toggle-${obj.id}`} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={`toggle-${obj.id}`}
                    className="sr-only"
                    checked={obj.isOn}
                    onChange={() => toggleObject(obj.id)}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full transition-colors duration-300
                    ${obj.isOn ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300
                    ${obj.isOn ? "translate-x-6" : "translate-x-0"}`}
                  ></div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-8 text-center">
          Status: {objects.filter((obj) => obj.isOn).length} device(s) ON
        </p>
      </div>
    </div>
  );
};

export default SmartLivingDashboard;
