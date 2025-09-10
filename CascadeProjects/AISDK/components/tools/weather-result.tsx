/**
 * @fileoverview Weather-specific tool result component
 * @description Displays weather information in a formatted card
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cloud, Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react'
import { WeatherData } from '@/types/tools'
import { cn } from '@/lib/utils'

interface WeatherResultProps {
  /** Weather data to display */
  data: WeatherData
  /** Execution time in milliseconds */
  executionTime?: number
  /** Whether to show detailed information */
  showDetails?: boolean
}

/**
 * Weather-specific result card component
 * @description Displays weather information with icons and formatted data
 * @param props - Component props including weather data
 * @returns JSX element containing formatted weather information
 */
export function WeatherResult({ data, executionTime, showDetails = true }: WeatherResultProps) {
  const getTemperatureColor = (temp: number, units?: string) => {
    // Default to celsius if units is undefined
    const isFahrenheit = units && units.includes('°F')
    const celsius = isFahrenheit ? ((temp - 32) * 5) / 9 : temp
    if (celsius < 0) return 'text-blue-600 dark:text-blue-400'
    if (celsius < 10) return 'text-cyan-600 dark:text-cyan-400'
    if (celsius < 20) return 'text-green-600 dark:text-green-400'
    if (celsius < 30) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  // Safely handle units - default to °C if undefined
  const displayUnits = data.units || '°C'

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            Weather in {data.location}
          </CardTitle>
          {executionTime && (
            <Badge variant="secondary" className="text-xs">
              {executionTime}ms
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Main weather info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('text-2xl font-bold', getTemperatureColor(data.temperature, displayUnits))}>
              {data.temperature}{displayUnits}
            </div>
            <div className="text-sm text-muted-foreground">
              {data.description}
              {data.feelsLike && (
                <div className="text-xs">Feels like {data.feelsLike}{displayUnits}</div>
              )}
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>Humidity: {data.humidity}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-gray-500" />
              <span>Wind: {data.windSpeed} {displayUnits.includes('°F') ? 'mph' : 'm/s'}</span>
            </div>
            
            {data.visibility && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span>Visibility: {data.visibility} km</span>
              </div>
            )}
            
            {data.pressure && (
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gray-500" />
                <span>Pressure: {data.pressure} hPa</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
