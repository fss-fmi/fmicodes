'use client';

import React, { useState } from 'react';
import { InfoIcon, X } from 'lucide-react';

export const TechColorLegend = () => {
  const [isVisible, setIsVisible] = useState(false);

  const categoryColors: Record<string, string> = {
    familiar_with_fields: '#FF5733', // Bright orange
    programming_languages: '#4285F4', // Google blue
    web_technologies: '#34A853', // Google green
    server_technologies: '#FBBC05', // Google yellow
    database_tools: '#A142F4', // Purple
    mobile_apps: '#E91E63', // Pink
    machine_learning: '#9C27B0', // Deep purple
    game_development: '#3F51B5', // Indigo
    hardware: '#009688', // Teal
    cloud_technologies: '#FF9800', // Amber
    tools: '#795548', // Brown
  };

  const categoryNamesBG: Record<string, string> = {
    familiar_with_fields: 'Области на познание',
    programming_languages: 'Програмни езици',
    web_technologies: 'Уеб технологии',
    server_technologies: 'Сървърни технологии',
    database_tools: 'Бази данни',
    mobile_apps: 'Мобилни приложения',
    machine_learning: 'Машинно обучение',
    game_development: 'Разработка на игри',
    hardware: 'Хардуер',
    cloud_technologies: 'Облачни технологии',
    tools: 'Инструменти',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 text-white dark:text-black">
      <button
        className="flex items-center justify-center bg-black text-white dark:bg-white dark:text-black rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Информация за цветовете"
      >
        <InfoIcon size={24} className="text-gray-600" />
      </button>

      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 bg-black dark:bg-white rounded-lg shadow-xl p-4 w-72 border border-gray-200 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-lg font-bold">
              Цветова легенда на технологиите
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Затвори"
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {Object.entries(categoryColors).map(([key, color]) => (
              <div key={key} className="flex items-center">
                <div
                  className="w-5 h-5 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-white dark:text-black">
                  {categoryNamesBG[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechColorLegend;
