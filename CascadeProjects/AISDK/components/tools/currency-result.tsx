/**
 * @fileoverview Currency conversion tool result component
 * @description Displays currency conversion information in a formatted card
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, DollarSign, TrendingUp } from 'lucide-react'
import { CurrencyData } from '@/types/tools'

interface CurrencyResultProps {
  /** Currency conversion data to display */
  data: CurrencyData
  /** Execution time in milliseconds */
  executionTime?: number
  /** Whether to show detailed information */
  showDetails?: boolean
}

/**
 * Currency conversion result card component
 * @description Displays currency conversion with exchange rate information
 * @param props - Component props including currency data
 * @returns JSX element containing formatted currency conversion
 */
export function CurrencyResult({ data, executionTime, showDetails = true }: CurrencyResultProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            Currency Conversion
          </CardTitle>
          {executionTime && (
            <Badge variant="secondary" className="text-xs">
              {executionTime}ms
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Main conversion display */}
        <div className="flex items-center justify-center gap-3 p-4 bg-background/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {formatCurrency(data.amount, data.from)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {data.from}
            </div>
          </div>
          
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.convertedAmount, data.to)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {data.to}
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>Exchange Rate:</span>
              </div>
              <span className="font-medium">
                1 {data.from} = {data.exchangeRate} {data.to}
              </span>
            </div>
            
            {data.lastUpdated && (
              <div className="text-xs text-muted-foreground text-center">
                Last updated: {new Date(data.lastUpdated).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
